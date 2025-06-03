import { authorize } from "./auth/authorize.js";
import { listLabels } from "./gmail/listLabels.js";

authorize().then(listLabels).catch(console.error);
