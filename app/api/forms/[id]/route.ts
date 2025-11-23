import { type NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Get a specific form
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sql = getDb();
    const { id } = await params;

    const result = await sql`
      SELECT * FROM forms WHERE id = ${id}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json({ form: result[0] });
  } catch (error) {
    console.error("[v0] Error fetching form:", error);
    return NextResponse.json(
      { error: "Failed to fetch form" },
      { status: 500 }
    );
  }
}

// Update a form
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sql = getDb();
    const { id } = await params;
    const body = await request.json();
    const { title, description, fields } = body;
    // Fetch current form and its fields
    const existing = await sql`
      SELECT * FROM forms WHERE id = ${id}
    `;

    if (existing.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const existingForm = existing[0];
    const existingFields =
      typeof existingForm.fields === "string"
        ? JSON.parse(existingForm.fields)
        : existingForm.fields;

    // Determine which fields changed type
    const changedFields: Array<{
      id: string;
      oldType: string;
      newType: string;
    }> = [];
    for (const newF of fields) {
      const oldF = existingFields.find((f: any) => f.id === newF.id);
      if (oldF && oldF.type !== newF.type) {
        changedFields.push({
          id: newF.id,
          oldType: oldF.type,
          newType: newF.type,
        });
      }
    }

    // If there are any changes, check whether those fields already have responses
    if (changedFields.length > 0) {
      const blocked: string[] = [];

      for (const ch of changedFields) {
        const countRes = await sql`
          SELECT COUNT(*) as count FROM responses WHERE form_id = ${id} AND (data ? ${ch.id})
        `;
        const cnt = Number(countRes[0]?.count || 0);
        if (cnt > 0) blocked.push(ch.id);
      }

      if (blocked.length > 0) {
        return NextResponse.json(
          {
            error: "Cannot change type for fields that already have responses",
            fields: blocked,
          },
          { status: 400 }
        );
      }
    }

    // No blocking responses found, proceed with update
    const result = await sql`
      UPDATE forms 
      SET 
        title = ${title},
        description = ${description || ""},
        fields = ${JSON.stringify(fields)},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json({ form: result[0] });
  } catch (error) {
    console.error("[v0] Error updating form:", error);
    return NextResponse.json(
      { error: "Failed to update form" },
      { status: 500 }
    );
  }
}

// Delete a form
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sql = getDb();
    const { id } = await params;

    await sql`DELETE FROM forms WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Error deleting form:", error);
    return NextResponse.json(
      { error: "Failed to delete form" },
      { status: 500 }
    );
  }
}
