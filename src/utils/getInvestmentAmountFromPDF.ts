import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

interface getInvestmentAmountFromPDFParams {
  pdfData: Uint8Array;
  password: string;
}

export const getInvestmentAmountFromPDF = async ({
  pdfData,
  password,
}: getInvestmentAmountFromPDFParams) => {
  const document = await getDocument({
    data: pdfData,
    password,
  }).promise;

  const page = await document.getPage(1);
  const data = await page.getTextContent();

  const amountLabel = data.items.find(
    (item): item is import("pdfjs-dist/types/src/display/api").TextItem =>
      "str" in item &&
      typeof item.str === "string" &&
      item.str.includes("Líquido para")
  );

  let amountValue: string | undefined = undefined;

  if (amountLabel) {
    const amountLabelIndex = data.items.indexOf(amountLabel);
    const prevItem = data.items[amountLabelIndex - 1];

    if ("str" in prevItem && typeof prevItem.str === "string") {
      amountValue = prevItem.str
        .replace("R$", "")
        .replace(".", "")
        .replace(",", ".")
        .trim();
    } else {
      throw new Error(
        "Previous item is not a TextItem or missing 'str' property."
      );
    }
  } else {
    throw new Error("Amount label not found in PDF text content.");
  }

  return parseFloat(amountValue);
};
