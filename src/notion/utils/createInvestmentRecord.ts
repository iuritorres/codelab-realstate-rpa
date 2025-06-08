import { env } from "../../env";
import { notion } from "../client";
import { RealStateCategory } from "../enums/notion";

interface CreateInvestmentRecordParams {
  category: RealStateCategory;
  amount: number;
  date: Date;
}

export const createInvestmentRecord = async ({
  category,
  amount,
  date,
}: CreateInvestmentRecordParams) => {
  const formattedDate = date.toISOString().slice(0, 10);

  console.log(
    `📈 Uploading investment record to Notion: - R$${amount} on ${formattedDate}`
  );

  try {
    await notion.pages.create({
      parent: {
        database_id: env.NOTION_REALSTATE_DATABASE_ID,
      },
      properties: {
        Source: {
          title: [
            {
              text: {
                content: "CodeLab RPA",
              },
            },
          ],
        },
        Category: {
          select: {
            name: category,
          },
        },
        Amount: {
          number: amount,
        },
        Date: {
          type: "date",
          date: {
            start: formattedDate,
          },
        },
      },
    });

    console.log("✅ Investment record successfully created in Notion.");
  } catch (error) {
    console.error("❌ Error creating investment record:", error);
    throw error;
  }
};
