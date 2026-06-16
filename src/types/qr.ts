// GET /locations/:locationId/qr
// or
// GET /locations/:locationId/qr?pathId=2
// QR code is returned as image/png content type
export type QRCode = Blob | null;