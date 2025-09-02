import torch
import os
from torch import nn, optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

data_dir = "backend/ai/skin_nail"
batch = 16
epochs = 5
lr = 1e-3
device = "cuda" if torch.cuda.is_available() else "cpu"

# Create demo data structure if it doesn't exist
os.makedirs(f"{data_dir}/train/healthy", exist_ok=True)
os.makedirs(f"{data_dir}/train/fungal", exist_ok=True)
os.makedirs(f"{data_dir}/train/psoriasis", exist_ok=True)
os.makedirs(f"{data_dir}/valid/healthy", exist_ok=True)
os.makedirs(f"{data_dir}/valid/fungal", exist_ok=True)
os.makedirs(f"{data_dir}/valid/psoriasis", exist_ok=True)

train_t = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor()
])
val_t = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

try:
    train_ds = datasets.ImageFolder(os.path.join(data_dir, "train"), transform=train_t)
    val_ds = datasets.ImageFolder(os.path.join(data_dir, "valid"), transform=val_t)
    train_dl = DataLoader(train_ds, batch_size=batch, shuffle=True)
    val_dl = DataLoader(val_ds, batch_size=batch)

    classes = train_ds.classes
    print(f"Found classes: {classes}")

    if len(train_ds) == 0:
        print("No training images found. Please add images to backend/ai/skin_nail/train/")
        # Create a dummy model for demo
        model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
        model.classifier[1] = nn.Linear(model.classifier[1].in_features, 3)
        torch.save({"state_dict": model.state_dict(), "classes": ["healthy", "fungal", "psoriasis"]}, "backend/ai/skin_model.pt")
        print("Created demo model -> backend/ai/skin_model.pt")
        exit()

    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, len(classes))
    model = model.to(device)

    crit = nn.CrossEntropyLoss()
    opt = optim.Adam(model.parameters(), lr=lr)

    for epoch in range(epochs):
        model.train()
        loss_sum = 0
        for x, y in train_dl:
            x, y = x.to(device), y.to(device)
            opt.zero_grad()
            out = model(x)
            loss = crit(out, y)
            loss.backward()
            opt.step()
            loss_sum += loss.item()
        
        model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for x, y in val_dl:
                x, y = x.to(device), y.to(device)
                out = model(x)
                pred = out.argmax(1)
                correct += (pred == y).sum().item()
                total += y.size(0)
        
        print(f"Epoch {epoch+1}: train_loss={loss_sum/len(train_dl):.4f} val_acc={correct/total:.3f}")

    torch.save({"state_dict": model.state_dict(), "classes": classes}, "backend/ai/skin_model.pt")
    print("Saved -> backend/ai/skin_model.pt")

except Exception as e:
    print(f"Training failed: {e}")
    # Create demo model anyway
    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, 3)
    torch.save({"state_dict": model.state_dict(), "classes": ["healthy", "fungal", "psoriasis"]}, "backend/ai/skin_model.pt")
    print("Created demo model -> backend/ai/skin_model.pt")
