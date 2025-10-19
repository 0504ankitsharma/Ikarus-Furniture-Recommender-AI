import { useState } from 'react';
import type { Product, RecommendedProduct } from '@/types';
import { extractGenText, normalizeCategories, normalizeImages, similarProducts } from '@/lib/api';

interface Props {
  item: RecommendedProduct | { product: Product; score?: number };
  showSimilarButton?: boolean;
}

export default function ProductCard({ item, showSimilarButton = true }: Props) {
  const { product, score } = item;
  const images = normalizeImages(product.images);
  const categories = normalizeCategories(product.categories);
  const [loading, setLoading] = useState(false);
  const [similars, setSimilars] = useState<RecommendedProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimilar = async () => {
    if (!product.uniq_id) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await similarProducts(product.uniq_id, 6);
      setSimilars(resp.items ?? []);
    } catch (e: any) {
      setError(e.message || 'Failed to load similar products');
    } finally {
      setLoading(false);
    }
  };

  const genText = extractGenText((item as any).generated_description);

  return (
    <div className="card">
      <div className="image-wrap">
        {images.length > 0 ? (
          <img src={images[0]} alt={product.title} onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
        ) : (
          <div className="placeholder">No image</div>
        )}
        {typeof score === 'number' && <span className="badge">Score: {score.toFixed(2)}</span>}
      </div>

      <div className="card-body">
        <h3 className="title">{product.title}</h3>
        <div className="meta">
          {product.brand && <span className="chip">{product.brand}</span>}
          {product.material && <span className="chip">{product.material}</span>}
          {product.color && <span className="chip">{product.color}</span>}
        </div>
        {product.price !== undefined && (
          <div className="price">${Number(product.price).toFixed(2)}</div>
        )}
        {categories.length > 0 && (
          <div className="categories">
            {categories.slice(0, 3).map((c) => (
              <span key={c} className="pill">{c}</span>
            ))}
          </div>
        )}

        {genText && <p className="generated">{genText}</p>}
        {!genText && product.description && <p className="desc">{product.description}</p>}

        {showSimilarButton && (
          <button className="btn" onClick={handleSimilar} disabled={loading}>
            {loading ? 'Loading...' : 'Find similar'}
          </button>
        )}

        {error && <div className="error">{error}</div>}

        {similars && (
          <div className="similar-grid">
            {similars.map((s) => (
              <div key={s.product.uniq_id} className="similar-item">
                <ProductCard item={s} showSimilarButton={false} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}