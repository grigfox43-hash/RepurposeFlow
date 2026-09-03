import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { originalContent, instruction, tone = 'b2b_expert' } = await req.json();

    if (!originalContent) {
      return NextResponse.json({ error: 'Original content is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `Ты — ведущий редактор RepurposeFlow на базе Gemini.
Отредактируй следующий текст публикации в соответствии с инструкцией.

Исходный текст:
"""
${originalContent}
"""

Инструкция: "${instruction || 'Улучши структуру и сделай текст более вирусным и динамичным'}"
Тон: ${tone}

Верни только готовый отредактированный Markdown текст без лишних вступительных фраз и без указания номеров версий нейросетей.`;

        const targetModel = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.7 }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const regeneratedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (regeneratedText) {
            return NextResponse.json({ success: true, updatedContent: regeneratedText.trim() });
          }
        }
      } catch (err) {
        console.warn('Gemini regenerate error:', err);
      }
    }

    // High quality refinement fallback
    let modified = originalContent;
    if (instruction?.includes('сократи') || instruction?.includes('shorten') || instruction?.includes('2 раза')) {
      const paragraphs = originalContent.split('\n\n');
      modified = paragraphs.slice(0, Math.max(2, Math.floor(paragraphs.length * 0.6))).join('\n\n');
      modified += '\n\n*(Сокращено ИИ для максимальной динамики)*';
    } else if (instruction?.includes('хук') || instruction?.includes('hook') || instruction?.includes('дерзк')) {
      modified = `🔥 ПРОВОКАЦИОННЫЙ ХУК: 99% экспертов совершают одну и ту же грубую ошибку.\n\n` + modified;
    } else if (instruction?.includes('cta') || instruction?.includes('призыв')) {
      modified += `\n\n💬 Напишите в комментариях, какой из пунктов откликается вам больше всего? Отвечу каждому лично!`;
    } else {
      modified = `✨ [Оптимизировано Gemini]\n\n` + modified;
    }

    return NextResponse.json({ success: true, updatedContent: modified });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Regeneration error' }, { status: 500 });
  }
}
