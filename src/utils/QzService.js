let qz;
let initializing = null;

export async function initQz() {
  if (qz && qz.websocket && qz.websocket.isActive && qz.websocket.isActive())
    return qz;
  if (initializing) return initializing;
  initializing = (async () => {
    const mod = await import("qz-tray");
    qz = mod.default || mod;
    try {
      if (!qz.websocket.isActive()) await qz.websocket.connect();
    } catch (e) {
      throw e;
    } finally {
      initializing = null;
    }
    return qz;
  })();
  return initializing;
}

export async function getPrinters() {
  try {
    await initQz();
    const list = await qz.printers.find();
    if (Array.isArray(list)) return list;
    return [list];
  } catch (e) {
    throw e;
  }
}

export async function printPdfBase64(base64Pdf, copies = 1, printerName = "") {
  await initQz();
  if (!printerName) throw new Error("Printer not specified");
  const config = qz.configs.create(printerName, {
    colorType: 'grayscale',
    interpolation: "nearest-neighbor"
  });
  const data = [
    {
      type: "pixel",
      format: "pdf",
      flavor: "base64",
      data: base64Pdf,
      density: "203"
    },
  ];
  for (let i = 0; i < copies; i++) {
    await qz.print(config, data);
  }
}
