const fs = require('fs');
let c = fs.readFileSync('src/components/admin/partners/partner-form.tsx', 'utf8');
c = c.replace(/<FormField<PartnerFormValues,\s*"[^"]+">/g, '<FormField');
fs.writeFileSync('src/components/admin/partners/partner-form.tsx', c);
