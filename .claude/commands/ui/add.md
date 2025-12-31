---
description: Add shadcn/ui components to the project
allowed-tools: Bash(npx:*), Bash(ls:*), Bash(cat:*)
argument-hint: <component-name> [component-name2 ...]
---

## Usage

This command adds shadcn/ui components to your project.

**Single component:**
```
/add dialog
```

**Multiple components:**
```
/add dialog toast alert
```

**Using natural language:**
```
add the dialog component
add toast and alert components
```

**List available components:**
```
what ui components can I add?
show me available shadcn components
```

## Project Configuration

This project uses shadcn/ui with the following settings:
- Style: new-york
- RSC: true (React Server Components)
- Icon Library: lucide-react
- Components Path: @/components/ui
- Base Color: neutral
- CSS Variables: true

## Current Context

- Installed components: !`ls components/ui/ 2>/dev/null | sed 's/\.tsx$//' | tr '\n' ', ' || echo "none"`
- Project configuration: !`cat components.json`

## Available shadcn/ui Components

### Forms & Input
input, textarea, select, checkbox, radio-group, switch, toggle, slider, label, form

### Buttons & Actions
button, toggle-group

### Navigation & Menus
dropdown-menu, context-menu, menubar, navigation-menu, breadcrumb, command, combobox

### Dialogs & Overlays
dialog, alert-dialog, sheet, drawer, popover, hover-card, tooltip

### Data Display
table, data-table, tabs, pagination, badge, avatar, separator, aspect-ratio

### Feedback & Status
toast, alert, progress, skeleton, spinner

### Layout & Structure
card, scroll-area, resizable, accordion, collapsible, carousel

### Date & Time
calendar, date-picker, date-range-picker

## Your Task

Install the requested shadcn/ui component(s): **$ARGUMENTS**

### Process:

1. **Validate Component Names**
   - Check if requested component(s) are valid shadcn/ui components (see list above)
   - If invalid, inform the user and suggest similar valid components

2. **Check for Duplicates**
   - Verify if component already exists in `components/ui/`
   - If exists, ask user if they want to overwrite

3. **Install Component(s)**
   - Run: `npx shadcn@latest add $ARGUMENTS --yes`
   - The `--yes` flag auto-confirms and uses existing components.json configuration
   - For multiple components: `npx shadcn@latest add dialog toast alert --yes`

4. **Verify Installation**
   - Check that files were created in `components/ui/`
   - List the installed files and their paths
   - Note any new dependencies added to package.json

5. **Provide Usage Examples**
   - Show import statement: `import { ComponentName } from "@/components/ui/component-name"`
   - Provide basic usage example from shadcn/ui docs if applicable

### Edge Cases:

- **Component already exists**: Ask if user wants to overwrite or skip
- **Missing dependencies**: The shadcn CLI will auto-install required packages
- **Multiple components**: Process all components in a single command when possible
- **Invalid component name**: Suggest correct component names from the list above

### Example Outputs:

After successful installation, provide:
```
✓ Installed: dialog
  Location: components/ui/dialog.tsx
  Import: import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
  Dependencies: @radix-ui/react-dialog added
```
