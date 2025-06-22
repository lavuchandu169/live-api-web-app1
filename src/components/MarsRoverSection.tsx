
import { useState, useEffect } from 'react';
import { Search, Calendar, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface MarsPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  camera: {
    name: string;
    full_name: string;
  };
  rover: {
    name: string;
  };
}

const MarsRoverSection = () => {
  const [photos, setPhotos] = useState<MarsPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRover, setSelectedRover] = useState('curiosity');
  const [selectedDate, setSelectedDate] = useState('2023-01-01');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const rovers = [
    { value: 'curiosity', label: 'Curiosity' },
    { value: 'opportunity', label: 'Opportunity' },
    { value: 'spirit', label: 'Spirit' },
    { value: 'perseverance', label: 'Perseverance' }
  ];

  const fetchMarsPhotos = async (rover: string, date: string, page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&page=${page}&api_key=WpmHNsPq2Mrunu1I9sTBjTsZ7BM7lqIngucQsqVL`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch Mars photos');
      }
      
      const data = await response.json();
      if (page === 1) {
        setPhotos(data.photos);
      } else {
        setPhotos(prev => [...prev, ...data.photos]);
      }
    } catch (error) {
      console.error('Error fetching Mars photos:', error);
      toast({
        title: "Error",
        description: "Failed to load Mars rover photos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchMarsPhotos(selectedRover, selectedDate, 1);
  }, [selectedRover, selectedDate]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchMarsPhotos(selectedRover, selectedDate, nextPage);
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Search className="text-primary" />
            Search Mars Rover Photos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/90 mb-2">Rover</label>
              <Select value={selectedRover} onValueChange={setSelectedRover}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select a rover" />
                </SelectTrigger>
                <SelectContent className="bg-space-dark border-white/20">
                  {rovers.map((rover) => (
                    <SelectItem key={rover.value} value={rover.value} className="text-white">
                      {rover.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-white/90 mb-2">Earth Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photos Grid */}
      {loading && photos.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : photos.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <p className="text-white/70">No photos found for this date and rover combination.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Card key={photo.id} className="glass-card overflow-hidden group hover:space-glow transition-all duration-300">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={photo.img_src}
                    alt={`Mars photo by ${photo.rover.name}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Camera size={16} />
                      <span className="text-sm font-medium">{photo.camera.name}</span>
                    </div>
                    <p className="text-white/90 text-sm">{photo.camera.full_name}</p>
                    <div className="flex items-center gap-2 text-white/70 text-xs">
                      <Calendar size={14} />
                      <span>{photo.earth_date}</span>
                    </div>
                    <p className="text-white/60 text-xs">Rover: {photo.rover.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {photos.length > 0 && !loading && (
            <div className="flex justify-center">
              <Button onClick={loadMore} className="bg-primary hover:bg-primary/80">
                Load More Photos
              </Button>
            </div>
          )}

          {loading && photos.length > 0 && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarsRoverSection;
