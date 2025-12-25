# Mobile UI Spacing Standardization Guide

## Overview
This guide ensures consistent spacing across all mobile UI components and pages in the Smart Kitchen app.

## Standardized Spacing System

### 1. Page Layout Classes

#### Container Classes
```css
.mobile-page-container     /* w-full max-w-7xl mx-auto */
.mobile-page-padding       /* px-4 sm:px-6 md:px-8 */
.mobile-page-spacing       /* py-4 sm:py-6 md:py-8 */
.mobile-page-wrapper       /* All-in-one page wrapper */
```

#### Section Spacing
```css
.mobile-section-spacing    /* space-y-4 sm:space-y-6 md:space-y-8 */
.mobile-subsection-spacing /* space-y-3 sm:space-y-4 md:space-y-5 */
.mobile-header-spacing     /* mb-4 sm:mb-6 md:mb-8 */
.mobile-bottom-safe        /* pb-20 sm:pb-6 md:pb-8 */
```

### 2. Component Spacing Classes

#### Card Components
```css
.mobile-card-padding         /* p-4 sm:p-5 md:p-6 */
.mobile-card-header-padding  /* px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 */
.mobile-card-content-padding /* px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 */
.mobile-card-wrapper         /* Complete card with styling */
```

#### Grid & Flex Layouts
```css
.mobile-grid-tight     /* grid gap-3 sm:gap-4 md:gap-5 */
.mobile-grid-normal    /* grid gap-4 sm:gap-5 md:gap-6 */
.mobile-grid-relaxed   /* grid gap-5 sm:gap-6 md:gap-8 */

.mobile-flex-tight     /* flex gap-2 sm:gap-3 md:gap-4 */
.mobile-flex-normal    /* flex gap-3 sm:gap-4 md:gap-5 */
.mobile-flex-relaxed   /* flex gap-4 sm:gap-5 md:gap-6 */
```

#### Button Groups
```css
.mobile-button-group   /* flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 */
.mobile-button-row     /* flex gap-2 sm:gap-3 md:gap-4 */
.mobile-action-bar     /* flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 */
.mobile-action-group   /* flex gap-1.5 sm:gap-2 md:gap-3 */
```

#### Form Components
```css
.mobile-form-spacing   /* space-y-4 sm:space-y-5 md:space-y-6 */
.mobile-form-grid      /* grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 */
.mobile-form-row       /* flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 */
.mobile-form-wrapper   /* Complete form wrapper */
```

### 3. Page-Specific Classes

#### HomeTab
```css
.home-tab-container      /* Complete page wrapper */
.home-tab-sections       /* Section spacing */
.home-tab-stats-grid     /* Stats cards grid */
.home-tab-quick-actions  /* Quick action buttons grid */
.home-tab-alerts-grid    /* Alerts and reminders grid */
```

#### InventoryTab
```css
.inventory-tab-container /* Complete page wrapper */
.inventory-tab-header    /* Header section */
.inventory-tab-actions   /* Action buttons */
.inventory-tab-stats     /* Stats cards */
.inventory-tab-filters   /* Filter controls */
.inventory-tab-items     /* Item grid */
```

#### ShoppingTab
```css
.shopping-tab-container  /* Complete page wrapper */
.shopping-tab-header     /* Header section */
.shopping-tab-stats      /* Stats cards */
.shopping-tab-layout     /* Main layout grid */
.shopping-tab-list-items /* List items spacing */
```

## Responsive Breakpoints

### Mobile First Approach
- **Mobile (< 640px)**: Tighter spacing for small screens
- **Tablet (641px - 768px)**: Medium spacing
- **Desktop (> 769px)**: Generous spacing

### Standard Breakpoints
```css
/* Mobile */
gap-3, p-4, space-y-4

/* Tablet (sm:) */
gap-4, p-5, space-y-5

/* Desktop (md:) */
gap-5, p-6, space-y-6
```

## Usage Guidelines

### 1. Page Layout
Always use the complete page wrapper for consistency:
```jsx
<div className="mobile-page-wrapper">
  {/* Page content */}
</div>
```

### 2. Section Spacing
Use standardized section spacing:
```jsx
<div className="mobile-section-spacing">
  <section>...</section>
  <section>...</section>
</div>
```

### 3. Grid Layouts
Use consistent grid spacing:
```jsx
{/* Stats cards */}
<div className="mobile-stats-grid">
  <Card>...</Card>
  <Card>...</Card>
</div>

{/* General grid */}
<div className="mobile-grid-normal">
  <Item>...</Item>
  <Item>...</Item>
</div>
```

### 4. Button Groups
Use standardized button layouts:
```jsx
{/* Action bar */}
<div className="mobile-action-bar">
  <Button>...</Button>
  <Button>...</Button>
</div>

{/* Button row */}
<div className="mobile-button-row">
  <Button>...</Button>
  <Button>...</Button>
</div>
```

### 5. Forms
Use consistent form spacing:
```jsx
<form className="mobile-form-wrapper">
  <div className="mobile-form-grid">
    <Input>...</Input>
    <Input>...</Input>
  </div>
</form>
```

## Quick Fixes

### Override Inconsistent Spacing
Use these utility classes to quickly fix spacing issues:
```css
.fix-mobile-spacing    /* Apply standard section spacing */
.fix-mobile-padding    /* Apply standard page padding */
.fix-mobile-grid       /* Apply standard grid spacing */
.fix-mobile-flex       /* Apply standard flex spacing */
.fix-mobile-card       /* Apply standard card padding */

/* Force overrides */
.override-spacing      /* !important spacing override */
.override-gap          /* !important gap override */
.override-padding      /* !important padding override */
```

## Common Patterns

### 1. Dashboard Page Structure
```jsx
<div className="mobile-page-wrapper">
  {/* Header */}
  <div className="mobile-header-spacing">
    <h1>Page Title</h1>
    <p>Description</p>
  </div>
  
  {/* Stats */}
  <div className="mobile-stats-grid">
    <StatCard />
    <StatCard />
  </div>
  
  {/* Actions */}
  <div className="mobile-action-bar">
    <Button />
    <Button />
  </div>
  
  {/* Content */}
  <div className="mobile-grid-normal">
    <Card />
    <Card />
  </div>
</div>
```

### 2. Card Content
```jsx
<Card className="mobile-card-wrapper">
  <CardHeader className="mobile-card-header-padding">
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent className="mobile-card-content-padding">
    <div className="mobile-subsection-spacing">
      <p>Content</p>
      <div className="mobile-button-row">
        <Button />
        <Button />
      </div>
    </div>
  </CardContent>
</Card>
```

### 3. Form Layout
```jsx
<form className="mobile-form-wrapper">
  <div className="mobile-form-grid">
    <div>
      <Label>Field 1</Label>
      <Input />
    </div>
    <div>
      <Label>Field 2</Label>
      <Input />
    </div>
  </div>
  
  <div className="mobile-button-group">
    <Button type="submit">Submit</Button>
    <Button type="button" variant="outline">Cancel</Button>
  </div>
</form>
```

## Migration Checklist

When updating existing components:

- [ ] Replace `space-y-*` with `mobile-section-spacing` or `mobile-subsection-spacing`
- [ ] Replace `gap-*` with `mobile-grid-*` or `mobile-flex-*` classes
- [ ] Replace `p-*` with `mobile-card-padding` or similar
- [ ] Replace `px-*` and `py-*` with responsive variants
- [ ] Use page-specific classes for major sections
- [ ] Test on mobile, tablet, and desktop breakpoints
- [ ] Ensure consistent spacing with other pages

## Benefits

1. **Consistency**: All pages use the same spacing scale
2. **Responsive**: Automatic scaling across breakpoints
3. **Maintainable**: Easy to update spacing globally
4. **Accessible**: Touch-friendly spacing on mobile
5. **Performance**: Reduced CSS bundle size through reuse

## Files Modified

- `frontend/src/styles/mobile-spacing-fix.css` - New standardization file
- `frontend/src/app/globals.css` - Updated utilities
- `frontend/src/styles/premium.css` - Updated mobile classes
- `frontend/src/app/dashboard/layout.tsx` - Updated layout
- `frontend/src/app/dashboard/home/HomeTab.tsx` - Updated spacing
- `frontend/src/app/dashboard/inventory/InventoryTab.tsx` - Updated spacing
- `frontend/src/app/dashboard/shopping/ShoppingTab.tsx` - Updated spacing