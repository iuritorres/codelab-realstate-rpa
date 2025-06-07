import { env } from "../../env";
import { notion } from "../client";
import { RealStateCategory } from "../enums/notion";

interface CreateInvestmentRecordParams {
  source: string;
  category: RealStateCategory;
  amount: number;
  date: Date;
}

export const createInvestmentRecord = async ({
  source,
  category,
  amount,
  date,
}: CreateInvestmentRecordParams) => {
  await notion.pages.create({
    parent: {
      database_id: env.NOTION_REALSTATE_DATABASE_ID,
    },
    properties: {
      Source: {
        title: [
          {
            text: {
              content: source,
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
          start: date.toISOString().slice(0, 10),
        },
      },
    },
  });
};
