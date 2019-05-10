Some use cases I need to build for

## Selection / Filtering

- Select all
  -> Everything on current page is selected, notification to select entirety
- Select entirety is selected
  -> Everything matching current filter is selected (call API to get list of id's)
- Select 2 things, filter down so that those aren't showing
  -> those should still remain 'selected'
- Filter from 100 down to 25 items, select all, clear filter
  -> 25 items are still selected, partial select all state set
