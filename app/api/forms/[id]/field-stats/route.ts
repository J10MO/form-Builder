import { type NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Return which fields have responses for a given form
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sql = getDb();
    const { id } = await params;

    // Get form
    const forms = await sql`
      SELECT * FROM forms WHERE id = ${id}
    `;

    if (forms.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const form = forms[0];
    const fields =
      typeof form.fields === "string" ? JSON.parse(form.fields) : form.fields;

    const result: Record<string, { hasResponses: boolean; count: number }> = {};

    for (const f of fields) {
      const cntRes = await sql`
        SELECT COUNT(*) as count FROM responses WHERE form_id = ${id} AND (data ? ${f.id})
      `;
      const cnt = Number(cntRes[0]?.count || 0);
      result[f.id] = { hasResponses: cnt > 0, count: cnt };
    }

    return NextResponse.json({ fields: result });
  } catch (error) {
    console.error("[v0] Error fetching field stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch field stats" },
      { status: 500 }
    );
  }
}
