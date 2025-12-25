let qz;
let initializing = null;

export async function initQz() {
  if (qz && qz.websocket && qz.websocket.isActive && qz.websocket.isActive())
    return qz;
  if (initializing) return initializing;
  initializing = (async () => {
    const mod = await import("qz-tray");
    qz = mod.default || mod;
    // qz.security.setCertificatePromise(() => Promise.resolve(""));
    // qz.security.setSignaturePromise(() => Promise.resolve("dummy"));
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
    size: {width: 58, height: 60}, units: 'mm',
    colorType: "grayscale",
    interpolation: "nearest-neighbor",
    density: "203",
    scaleContent: false,
    copies
  });
  const data = [
    {
      type: "pixel",
      format: "pdf",
      flavor: "base64",
      data: base64Pdf,
      options: { ignoreTransparency: true, altFontRendering: true }
    },
  ];
  await qz.print(config, data);
}

export async function printPngBase64(base64Png, copies = 1, printerName = "") {
  await initQz();
  if (!printerName) throw new Error("Printer not specified");
  const config = qz.configs.create(printerName, {
    colorType: "grayscale",
    interpolation: "nearest-neighbor",
    density: "203",
    scaleContent: "false",
    copies
  });
  const data = [
    {
      type: "pixel",
      format: "image",
      flavor: "base64",
      data: base64Png,
    },
  ];
  await qz.print(config, data);
}
