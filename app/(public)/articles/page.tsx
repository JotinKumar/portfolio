import { ArticleCard } from '@/components/sections/article-card';
import { getPublishedArticleCategories, getPublishedArticles } from '@/lib/server/queries';
import type { Article } from '@/lib/db-types';

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';

interface ArticlesPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  let articles: Article[] = [];
  let uniqueCategories: string[] = [];
  
  try {
    articles = (await getPublishedArticles(params.category, params.search)) as Article[];
    uniqueCategories = await getPublishedArticleCategories();
  } catch {
    console.log('Database not available, using empty state');
  }

  return (
    <section className="py-12">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Articles</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thoughts on business processes, technology, and the future of work.
          </p>
        </div>

        {/* Filter Section */}
        {uniqueCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            <a 
              href="/articles"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !params.category 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              All
            </a>
            {uniqueCategories.map((category) => (
              <a 
                key={category}
                href={`/articles?category=${encodeURIComponent(category)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  params.category === category
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {category}
              </a>
            ))}
          </div>
        )}

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              {params.search || params.category
                ? 'Try adjusting your filters to see more articles.'
                : 'Articles will appear here once they are published.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
