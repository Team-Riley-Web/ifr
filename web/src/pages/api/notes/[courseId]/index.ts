import type { APIRoute } from 'astro';
import { getCourse, getPdfObjectKey } from '../../../../lib/courses';
import { getCourseNotes, getCourseNotesDebug } from '../../../../lib/pdf-notes';
import { hasR2Config } from '../../../../lib/r2';

export const GET: APIRoute = async ({ locals, params, url }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const courseId = params.courseId ?? '';
  const course = getCourse(courseId);
  if (!course) {
    return new Response(JSON.stringify({ error: 'Course not found' }), { status: 404 });
  }

  const notes = await getCourseNotes(course.id);
  const debug = url.searchParams.get('debug') === '1';

  if (!debug) {
    return new Response(JSON.stringify(notes), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const notesDebug = await getCourseNotesDebug(course.id);
  const lessonIds = Object.keys(notes);
  return new Response(JSON.stringify({
    courseId: course.id,
    pdfObjectKey: getPdfObjectKey(course.id),
    hasR2Config,
    lessonCount: course.lessons.length,
    notesCount: lessonIds.length,
    noteLessonIds: lessonIds,
    debug: {
      ...notesDebug,
      notes: undefined,
    },
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
