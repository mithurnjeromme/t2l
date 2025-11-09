# Filter Features - Quick Reference Guide

## 🎛️ Available Filters

### 1. **Price Range Filter**
- **Type**: Dual-handle slider
- **Range**: ₹0 - ₹10,000
- **Step**: ₹500
- **Display**: Shows current min and max values
- **Effect**: Filters lawyers by consultation fee

### 2. **Locations Filter** (Multi-select)
- **Type**: Checkbox list
- **Options**: 
  - Chennai
  - Mumbai
  - Delhi
  - Bangalore
  - Hyderabad
  - Kolkata
- **Behavior**: Selects multiple locations (OR logic)
- **Effect**: Shows lawyers from any selected city

### 3. **Case Types Filter** (Multi-select)
- **Type**: Checkbox list
- **Options**:
  - Property and Estate
  - Divorce
  - Criminal
  - Tax & Corporate
  - General Legal
- **Behavior**: Selects multiple case types (OR logic)
- **Effect**: Shows lawyers specializing in any selected type

### 4. **Languages Filter** (Multi-select) ✨ NEW
- **Type**: Checkbox list
- **Options**:
  - English
  - Hindi
  - Tamil
  - Telugu
  - Bengali
  - Kannada
  - Malayalam
- **Behavior**: Selects multiple languages (OR logic)
- **Effect**: Shows lawyers speaking any selected language
- **Data Source**: `lawyer.languages` array from backend

### 5. **Minimum Experience Filter**
- **Type**: Single-handle slider
- **Range**: 0 - 30 years
- **Step**: 1 year
- **Display**: Shows "X+ years"
- **Effect**: Filters lawyers with at least X years of experience

### 6. **Minimum Rating Filter**
- **Type**: Single-handle slider
- **Range**: 0 - 5 stars
- **Step**: 0.5 stars
- **Display**: Shows rating value + visual stars (⭐⭐⭐⭐⭐)
- **Effect**: Filters lawyers with rating >= selected value

### 7. **Sort By Filter** ✨ NEW
- **Type**: Dropdown (single-select)
- **Options**:
  - **Highest Rating** - Sorts by `lawyer.rating` (descending)
  - **Price: Low to High** - Sorts by `consultation_fee` (ascending)
  - **Price: High to Low** - Sorts by `consultation_fee` (descending)
  - **Most Experienced** - Sorts by `years_experience` (descending)
  - **Most Reviews** - Sorts by `lawyer.reviews` (descending)
- **Default**: Highest Rating
- **Effect**: Changes the order of filtered results

### 8. **Availability Filter** ✨ NEW
- **Type**: Dropdown (single-select)
- **Options**:
  - **All Lawyers** - Shows everyone
  - **Available Now** - Only shows `lawyer.available_now === true`
  - **Verified Only** - Only shows `lawyer.verified === true`
- **Default**: All Lawyers
- **Effect**: Filters by availability status

### 9. **Verified Only Toggle** ✨ NEW
- **Type**: Checkbox toggle
- **States**: ON / OFF
- **Default**: OFF
- **Effect**: When ON, only shows lawyers where `lawyer.verified === true`
- **Visual**: Green "Verified" badge appears on lawyer cards

---

## 🔄 Filter Combination Logic

### How Filters Work Together:

1. **Within Multi-select** (OR logic):
   - Locations: `Mumbai OR Delhi OR Chennai`
   - Case Types: `Criminal OR Divorce`
   - Languages: `Hindi OR Tamil OR English`

2. **Between Filters** (AND logic):
   - Price Range: `fee >= min AND fee <= max`
   - Location: `(Mumbai OR Delhi) AND`
   - Case Type: `(Criminal OR Divorce) AND`
   - Experience: `>= minExperience AND`
   - Rating: `>= minRating`

3. **Example Combination**:
   ```
   Locations: [Mumbai, Delhi]
   Case Types: [Criminal, Property]
   Languages: [Hindi, English]
   Min Experience: 10
   Min Rating: 4.0
   
   Results: Lawyers in (Mumbai OR Delhi) 
            AND specializing in (Criminal OR Property)
            AND speaking (Hindi OR English)
            AND with 10+ years experience
            AND rating >= 4.0
   ```

---

## 📊 Filter State Structure

```typescript
interface FilterState {
  priceRange: [number, number];        // [min, max] in rupees
  locations: string[];                 // Array of selected cities
  caseTypes: string[];                 // Array of selected case types
  minExperience: number;               // Minimum years
  minRating: number;                   // Minimum rating (0-5)
  languages: string[];                 // Array of selected languages
  sortBy: 'rating' | 'price-low' | 'price-high' | 'experience' | 'reviews';
  availability: 'all' | 'available' | 'verified';
  verified: boolean;                   // True = verified only
}
```

### Default State:
```javascript
{
  priceRange: [0, 10000],
  locations: [],
  caseTypes: [],
  minExperience: 0,
  minRating: 0,
  languages: [],
  sortBy: 'rating',
  availability: 'all',
  verified: false
}
```

---

## 🎯 Backend Data Requirements

### Lawyer Object Must Include:

```typescript
interface LawyerProfile {
  // Required for filtering
  consultation_fee_formatted: string;  // e.g., "₹4,300"
  location: string;                     // e.g., "Kochi Family Court"
  city?: string;                        // e.g., "Kochi"
  specialization: string;               // e.g., "Tax Law"
  category: string;                     // e.g., "Tax & Corporate"
  experience: string;                   // e.g., "28+ years"
  rating: number;                       // e.g., 4.8
  
  // Required for advanced filtering
  languages?: string[];                 // e.g., ["English", "Hindi", "Tamil"]
  reviews: number;                      // e.g., 390
  verified?: boolean;                   // e.g., true
  available_now?: boolean;              // e.g., false
}
```

---

## 🔧 Implementation Details

### Filter Application Flow:

```
1. User changes filter
   ↓
2. setFilters() updates state
   ↓
3. useEffect triggers on filter change
   ↓
4. applyFilters() function runs
   ↓
5. Filters allLawyers array
   ↓
6. Sorts filtered results
   ↓
7. setFilteredLawyers() updates display
   ↓
8. UI re-renders with new results
```

### Performance Optimizations:

1. **Debouncing**: Not needed (instant feedback is better UX)
2. **Memoization**: Filter options are constant arrays
3. **Array Methods**: Using efficient `.filter()` and `.sort()`
4. **Re-render Control**: Only filteredLawyers triggers grid re-render

---

## 📱 Mobile Considerations

### Sidebar Behavior:
- **Desktop**: Fixed sidebar, always visible
- **Mobile**: May need hamburger menu (future enhancement)
- **Scrolling**: Sidebar is scrollable independently

### Checkbox Lists:
- **Max Height**: 160px with scroll
- **Touch Targets**: 44px minimum for mobile
- **Spacing**: Adequate for finger taps

---

## 🎨 Visual Feedback

### Active Filters Show:
1. **Checked checkboxes** - Yellow accent color
2. **Slider positions** - Yellow handles
3. **Selected values** - Yellow text
4. **Results count** - Dynamic badge showing filtered count

### Reset All Filters:
- Prominent yellow button at bottom of sidebar
- Returns all filters to default state
- Shows all lawyers again

---

## 🚀 Usage Examples

### Example 1: Find Affordable Criminal Lawyers in Mumbai
```
✓ Locations: [Mumbai]
✓ Case Types: [Criminal]
✓ Price Range: [0, 3000]
✓ Sort By: Price: Low to High
```

### Example 2: Find Top-Rated Property Lawyers
```
✓ Case Types: [Property and Estate]
✓ Min Rating: 4.5
✓ Verified Only: ON
✓ Sort By: Highest Rating
```

### Example 3: Find Experienced Tamil-Speaking Lawyers
```
✓ Languages: [Tamil]
✓ Min Experience: 15
✓ Sort By: Most Experienced
```

### Example 4: Find Available Lawyers for Urgent Matters
```
✓ Availability: Available Now
✓ Sort By: Highest Rating
```

---

## 🐛 Edge Cases Handled

1. **No filters selected**: Shows all lawyers
2. **No results found**: Shows empty state with reset button
3. **Invalid price range**: Slider prevents invalid states
4. **Missing data fields**: Uses optional chaining (`?.`)
5. **Array operations**: Handles empty arrays gracefully

---

## 📈 Future Enhancements (Suggestions)

1. **Save Filter Presets** - Let users save favorite filter combinations
2. **Filter Badges** - Show active filters as removable badges
3. **Advanced Search** - Combine AI prompt with filters
4. **URL Parameters** - Save filter state in URL for sharing
5. **Filter Analytics** - Track most-used filters
6. **Custom Price Ranges** - Let users type exact values
7. **More Languages** - Expand language options
8. **Court Locations** - Add specific court filters

---

**Status**: All filters fully functional and tested! ✨
