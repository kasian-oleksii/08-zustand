import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;

  const initialPage = 1;
  const initialQuery = '';

  const tagParam = decodeURIComponent(slug[0]);
  const initialTag = tagParam === 'all' ? undefined : tagParam;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', initialPage, initialQuery, initialTag],
    queryFn: () => fetchNotes(initialPage, initialQuery, initialTag),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient initialTag={initialTag} />
    </HydrationBoundary>
  );
}
