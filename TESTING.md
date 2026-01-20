# Testing Checklist

## Functionality Tests
- [ ] Homepage loads within 3 seconds on 3G
- [ ] Registration flow completes successfully
- [ ] All 5 registration steps validate correctly
- [ ] Weather dashboard loads with real data
- [ ] District selection updates weather
- [ ] Language toggle works on all pages
- [ ] Contact form submits successfully
- [ ] Navigation links work correctly
- [ ] Mobile menu opens/closes properly
- [ ] All CTAs link to correct pages

## Mobile Tests (Test on actual devices if possible)
- [ ] All text is readable (min 14px)
- [ ] All buttons are tappable (min 44x44px)
- [ ] Forms work with mobile keyboard
- [ ] Images load correctly
- [ ] No horizontal scrolling
- [ ] Touch interactions feel smooth
- [ ] Back button works correctly

## Browser Tests
- [ ] Chrome (desktop & mobile)
- [ ] Firefox
- [ ] Safari (desktop & mobile)
- [ ] Edge

## Performance Tests
- [ ] Lighthouse score > 80 on mobile
- [ ] Images are compressed
- [ ] No console errors
- [ ] Page loads without breaking

## Accessibility Tests
- [ ] Can navigate with keyboard only
- [ ] Screen reader announces content correctly
- [ ] Color contrast meets WCAG AA standards
- [ ] All images have alt text
- [ ] Form labels are properly associated

## Offline Tests
- [ ] Service worker registers successfully
- [ ] Pages cached for offline viewing
- [ ] Offline message displays when no connection