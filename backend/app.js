import express from 'express'; 
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './src/routes/auth.routes.js';
import auditRoutes from './src/routes/audit.routes.js';
import formRoutes from './src/routes/form.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';
import pricingRoutes from './src/routes/pricing.routes.js';
import reAuditRoutes from './src/routes/reAudit.routes.js';
import adminRoutes from './src/routes/admin.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/re-audit', reAuditRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.json({
        msg: "Audit Ai Backend API is running ✅"
    });
});

export default app;