interface PixabayVideo {
  id: number;
  user: string;
  tags: string;
  videos: {
    large: {
      url: string;
      width: number;
      height: number;
      size: number;
    };
    medium: {
      url: string;
      width: number;
      height: number;
      size: number;
    };
    small: {
      url: string;
      width: number;
      height: number;
      size: number;
    };
    tiny: {
      url: string;
      width: number;
      height: number;
      size: number;
    };
  };
}

interface PixabayImage {
  id: number;
  user: string;
  tags: string;
  webformatURL: string;
  largeImageURL: string;
  fullHDURL: string;
  imageWidth: number;
  imageHeight: number;
}

interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: PixabayVideo[] | PixabayImage[];
}

class PixabayService {
  private apiKey: string;
  private baseUrl = 'https://pixabay.com/api/';

  constructor() {
    this.apiKey = process.env.PIXABAY_API_KEY || '';
    if (!this.apiKey) {
      console.warn('PIXABAY_API_KEY not found in environment variables');
    }
  }

  async searchVideos(query: string = 'travel landscape tourism', perPage: number = 20): Promise<string[]> {
    try {
      const params = new URLSearchParams({
        key: this.apiKey,
        q: query,
        video_type: 'all',
        category: 'places',
        min_width: '1920',
        min_height: '1080',
        per_page: perPage.toString(),
        safesearch: 'true',
        order: 'popular'
      });

      const response = await fetch(`${this.baseUrl}videos/?${params}`);
      
      if (!response.ok) {
        throw new Error(`Pixabay API error: ${response.status}`);
      }

      const data: PixabayResponse = await response.json();
      
      return (data.hits as PixabayVideo[]).map(video => {
        // Priorizar calidad: large > medium > small
        if (video.videos.large) {
          return video.videos.large.url;
        } else if (video.videos.medium) {
          return video.videos.medium.url;
        } else {
          return video.videos.small.url;
        }
      });
    } catch (error) {
      console.error('Error fetching Pixabay videos:', error);
      return [];
    }
  }

  async searchImages(query: string = 'travel landscape tourism beautiful', perPage: number = 20): Promise<string[]> {
    try {
      const params = new URLSearchParams({
        key: this.apiKey,
        q: query,
        image_type: 'photo',
        category: 'places',
        min_width: '1920',
        min_height: '1080',
        per_page: perPage.toString(),
        safesearch: 'true',
        order: 'popular'
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Pixabay API error: ${response.status}`);
      }

      const data: PixabayResponse = await response.json();
      
      return (data.hits as PixabayImage[]).map(image => {
        // Priorizar calidad más alta disponible
        return image.fullHDURL || image.largeImageURL || image.webformatURL;
      });
    } catch (error) {
      console.error('Error fetching Pixabay images:', error);
      return [];
    }
  }

  async getTravelContent(): Promise<{ videos: string[], images: string[] }> {
    const [videos, images] = await Promise.all([
      this.searchVideos('beautiful travel destinations landscape nature tourism mountains beach city', 10),
      this.searchImages('stunning travel destinations landscape nature tourism scenic beautiful', 10)
    ]);

    return { videos, images };
  }
}

export const pixabayService = new PixabayService();