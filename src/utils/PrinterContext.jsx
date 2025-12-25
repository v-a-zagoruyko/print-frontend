import { createContext, useContext, createSignal, onMount } from "solid-js";
import * as qzService from "./QzService";

const LOCAL_KEY = "qz_selected_printer";
const PrinterContext = createContext();

export function PrinterProvider(props) {
  const [qzLoaded, setQzLoaded] = createSignal(false);
  const [printers, setPrinters] = createSignal([]);
  const [selectedPrinter, setSelectedPrinter] = createSignal(
    localStorage.getItem(LOCAL_KEY) || ""
  );
  const [qzError, setQzError] = createSignal(null);

  async function initQzConnection() {
    try {
      await qzService.initQz();
      setQzLoaded(true);
      setQzError(null);
      return true;
    } catch (e) {
      setQzLoaded(false);
      setQzError(e?.message || String(e));
      throw e;
    }
  }

  async function refreshPrinters() {
    try {
      await initQzConnection();
      const list = await qzService.getPrinters();
      setPrinters(list || []);
      if (!selectedPrinter() && list.length) {
        setSelectedPrinter(list[0]);
        try {
          localStorage.setItem(LOCAL_KEY, list[0]);
        } catch (e) {}
      }
      return list;
    } catch (e) {
      setQzError(e?.message || String(e));
      setQzLoaded(false);
      throw e;
    }
  }

  function choosePrinter(name) {
    setSelectedPrinter(name);
    try {
      localStorage.setItem(LOCAL_KEY, name);
    } catch (e) {}
  }

  async function printBase64(pdfBase64, copies = 1) {
    const printer = selectedPrinter();
    if (!printer) throw new Error("Принтер не выбран");
    await qzService.printPdfBase64(pdfBase64, copies, printer);
  }

  onMount(() => {
    (async () => {
      try {
        await refreshPrinters();
      } catch {
        // Уже обработали ошибку внутри refreshPrinters
      }
    })();
  });

  const store = {
    printers,
    selectedPrinter,
    choosePrinter,
    refreshPrinters,
    printBase64,
    qzLoaded,
    qzError,
    initQzConnection,
  };

  return (
    <PrinterContext.Provider value={store}>
      {props.children}
    </PrinterContext.Provider>
  );
}

export function usePrinter() {
  return useContext(PrinterContext);
}
