const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  actor: { type: String, required: true, trim: true },
  action: { type: String, required: true, trim: true },
  targetType: { type: String, required: true, trim: true },
  targetId: { type: String, required: true, trim: true },
  summary: { type: String, required: true, trim: true, maxlength: 200 },
}, { timestamps: true });

auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
