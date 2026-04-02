import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import SectionList from "./_components/SectionList";

type Props = { params: Promise<{ id: string }> };

// generateMetadata とページ本体で同一リクエスト内のクエリを共有
const getCourse = cache(async (id: string) => {
  const supabase = await createClient();
  return supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getCourse(id);
  return { title: data?.title ?? "コース詳細" };
}

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params;

  // 講座とセクションを並列取得
  const [{ data: course, error }, { data: sections }] = await Promise.all([
    getCourse(id),
    (await createClient())
      .from("sections")
      .select("*")
      .eq("course_id", id)
      .order("order_index"),
  ]);

  if (error || !course) notFound();

  // セクションIDが確定してからレッスンと進捗を並列取得（N+1クエリ解消）
  const sectionIds = sections?.map((s) => s.id) ?? [];
  const supabase = await createClient();
  const [{ data: lessons }, { data: progressData }] = await Promise.all([
    sectionIds.length > 0
      ? supabase
          .from("lessons")
          .select("*")
          .in("section_id", sectionIds)
          .order("order_index")
      : Promise.resolve({
          data: [] as {
            id: string;
            section_id: string | null;
            title: string;
            youtube_id: string;
            duration_sec: number | null;
            order_index: number;
          }[],
          error: null,
        }),
    supabase.from("progress").select("lesson_id").eq("completed", true),
  ]);

  const completedIds = new Set(
    progressData?.map((p) => p.lesson_id ?? "").filter(Boolean),
  );

  // セクションにレッスンを紐付け
  const sectionsWithLessons = (sections ?? []).map((section) => ({
    ...section,
    lessons: (lessons ?? []).filter((l) => l.section_id === section.id),
  }));

  const totalLessons = lessons?.length ?? 0;
  const completedCount =
    lessons?.filter((l) => completedIds.has(l.id)).length ?? 0;
  const totalDuration =
    lessons?.reduce((sum, l) => sum + (l.duration_sec ?? 0), 0) ?? 0;
  const totalMin = Math.round(totalDuration / 60);
  const progressPct =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <>
      {/* Hero */}
      <div className="relative bg-liner-to-br from-slate-900 via-violet-950 to-slate-900">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 right-0 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-6">
          <Link
            href="/courses"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-violet-300 transition-colors hover:text-white"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            コース一覧に戻る
          </Link>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            {/* Text info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
                {course.title}
              </h1>
              {course.description && (
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-violet-200">
                  {course.description}
                </p>
              )}
              {/* Stats */}
              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-violet-300">
                <span className="flex items-center gap-1.5">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75z"
                    />
                  </svg>
                  {sections?.length ?? 0} セクション
                </span>
                <span className="flex items-center gap-1.5">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82z" />
                  </svg>
                  {totalLessons} レッスン
                </span>
                {totalMin > 0 && (
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path strokeLinecap="round" d="M12 6v6l4 2" />
                    </svg>
                    合計 {totalMin} 分
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail */}
            {course.thumbnail_url && (
              <div className="w-full overflow-hidden rounded-2xl shadow-2xl lg:w-72 xl:w-80">
                <div className="relative aspect-video">
                  <Image
                    src={course.thumbnail_url}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 320px"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
        {/* Progress bar */}
        {totalLessons > 0 && (
          <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">学習の進捗</span>
              <span className="font-semibold text-violet-600">
                {progressPct}% 完了
              </span>
            </div>
            <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              {completedCount} / {totalLessons} レッスン完了
            </p>
          </div>
        )}

        {/* Section list */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">コースの内容</h2>
          {sectionsWithLessons.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
              <p className="text-sm text-gray-400">
                レッスンはまだ追加されていません。
              </p>
            </div>
          ) : (
            <SectionList
              sections={sectionsWithLessons}
              courseId={id}
              completedIds={completedIds}
            />
          )}
        </div>
      </main>
    </>
  );
}
