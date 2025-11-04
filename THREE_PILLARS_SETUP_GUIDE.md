# Three Pillars Section - Setup Guide

## ✅ Successfully Integrated!

The Three Pillars section has been successfully added to your Turn2Law website!

### 📁 Files Created:

1. **`/components/ui/wobble-card.tsx`** - Core wobble card component with motion effects
2. **`/components/sections/three-pillars.tsx`** - Three pillars section showcasing Turn2Law's services
3. **`/app/page.tsx`** - Updated to include the new section

---

## 🎨 Color Scheme Applied:

The component now uses Turn2Law's brand colors:
- **Primary (Gold)**: `#DBAD00` - Used for "Automated Document Drafting" card
- **Secondary (Teal)**: `#009E98` - Used for "Client-Lawyer Matchmaking" card
- **Card Background**: Dark theme with subtle gradients
- **Text**: White and muted colors for readability

---

## 📍 Section Placement:

The Three Pillars section is now placed **right after the "About" section** on the home page:

```
Home Page Structure:
├─ Hero
├─ ServicesGrid
├─ About
├─ ✨ Three Pillars (NEW!)
├─ Stats
├─ Banner
├─ KnowAboutUs
└─ ContactForm
```

---

## 🖼️ Images Required:

You need to add these images to your project:

### 1. **noise.webp** (Background texture)
**Location**: `/frontend/public/noise.webp`
- This creates a subtle texture overlay on the cards
- You can find noise textures online or create one
- Alternatively, remove the `<Noise />` component if you don't want this effect

### 2. **linear.webp** (Illustration images)
**Location**: `/frontend/public/linear.webp`
- This is used for the card illustrations
- **You mentioned you'll provide images later** - Perfect! 
- When ready, replace `/linear.webp` with your custom images for each pillar

---

## 🔄 How to Update Images:

### Option 1: Use Different Images for Each Pillar

Edit `/components/sections/three-pillars.tsx` and change the image sources:

```tsx
// Pillar 1 - Client-Lawyer Matchmaking
<img src="/images/matchmaking.webp" ... />

// Pillar 2 - Document Drafting
// (Optional - currently no image on small card)

// Pillar 3 - Legal Services & Chatbot
<img src="/images/chatbot.webp" ... />
```

### Option 2: Remove Images Temporarily

If you don't have images yet, you can comment out the `<img>` tags in the component.

---

## 🎯 The Three Pillars:

### 1. **Online Client-Lawyer Matchmaking** (Teal Card - Large)
- Icon: Users
- Color: Secondary (Teal/Turquoise)
- Position: Top-left, spans 2 columns on large screens
- Description: Intelligent matching system

### 2. **Automated Document Drafting** (Gold Card - Small)
- Icon: FileText
- Color: Primary (Gold/Yellow)
- Position: Top-right, 1 column
- Description: AI-powered document generation

### 3. **Legal Services with AI Chatbot** (Dark Card - Full Width)
- Icon: MessageSquare
- Color: Card background with primary accents
- Position: Bottom, spans full width
- Description: 24/7 AI legal guidance

---

## ✨ Features:

- **Interactive Hover Effects**: Cards wobble and scale on mouse movement
- **Responsive Design**: Stacks on mobile, grid on desktop
- **Brand Colors**: Matches Turn2Law's color scheme
- **Icons**: Uses Lucide React icons
- **Motion**: Smooth animations using motion/react

---

## 🚀 Next Steps:

1. **Add Images**: 
   - Add `noise.webp` to `/public/` folder (optional texture)
   - Add illustration images for each pillar
   
2. **Customize Content**: 
   - Edit descriptions in `/components/sections/three-pillars.tsx`
   - Adjust card sizes if needed
   
3. **Test**: 
   - Visit `http://localhost:9002/`
   - The section appears after "About" (What is Turn2Law)
   - Hover over cards to see the wobble effect

---

## 📝 To Update Images Later:

1. Save your images to `/frontend/public/images/`
2. Update the image paths in `three-pillars.tsx`:
   ```tsx
   <img src="/images/your-image.png" ... />
   ```

---

## 🎨 Customization Options:

### Change Card Colors:
Edit the `containerClassName` prop in `three-pillars.tsx`:
```tsx
// Current: bg-gradient-to-br from-secondary to-secondary/80
// Change to: bg-gradient-to-br from-primary to-primary/80
```

### Adjust Card Heights:
```tsx
// Change min-h-[300px] to your desired height
containerClassName="... min-h-[400px]"
```

### Remove Images:
Simply delete the `<img>` tags if you don't need them.

---

## ✅ Status:

- ✅ Component created
- ✅ Integrated into home page
- ✅ Brand colors applied
- ✅ Zero compilation errors
- ⏳ Images to be added (noise.webp, illustrations)

---

**Your Three Pillars section is live and ready! The cards will have beautiful wobble effects on hover and showcase your three core services.** 🎉

Visit: `http://localhost:9002/` to see it in action!
