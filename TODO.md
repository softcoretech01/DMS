# TODO - Frontend error fix + faster browser

- [ ] Add missing `switchUserRole` implementation to `src/context/DMSContext.js` and expose it in the context value.
- [ ] Make `src/components/Layout.js` resilient if `switchUserRole` is absent (defensive guard) and use the context function.
- [ ] Remove artificial upload delay in `src/pages/DocumentUpload.js` (`setTimeout` / simulated delay) so UI responds immediately.
- [ ] Remove artificial download delay in `src/pages/BulkOperations.js` (simulation delay) so bulk actions feel instant.
- [ ] Build/run frontend and verify no runtime errors in browser console; verify role switching + UI gating works.


