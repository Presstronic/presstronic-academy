Modal with notched top-right corner, mono eyebrow + display title, footer action row.

```jsx
<Dialog open={open} onClose={close} eyebrow="// CONFIRM" title="Abandon this branch?"
  footer={<><Button variant="ghost" onClick={close}>Stay</Button><Button variant="destructive">Abandon</Button></>}>
  Progress on this path will be checkpointed, not lost.
</Dialog>
```
