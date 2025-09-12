import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, DollarSign, Star, Plus, MessageSquare } from "lucide-react";
import type { Trip } from "@shared/schema";

interface CommunityCardProps {
  trip: Trip;
  onSave?: (tripId: string) => void;
}

export default function CommunityCard({ trip, onSave }: CommunityCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getDurationInDays = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Use destination images or fallback to generic travel images
  const getDestinationImage = (destination: string) => {
    const images: Record<string, string> = {
      'París': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=200',
      'Roma': 'https://images.unsplash.com/photo-1552832230-c0197ccb2649?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=200',
      'Tokio': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=200',
    };
    
    return images[destination] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=200';
  };

  const duration = getDurationInDays();
  const budget = trip.budget ? parseFloat(trip.budget) : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`community-card-${trip.id}`}>
      <img 
        src={getDestinationImage(trip.destination)} 
        alt={`${trip.destination} travel destination`}
        className="w-full h-48 object-cover"
        data-testid={`img-destination-${trip.id}`}
      />
      
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-sm font-medium">
            {trip.userId.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-sm" data-testid={`text-trip-owner-${trip.id}`}>
              Usuario #{trip.userId.slice(-6)}
            </p>
            <p className="text-xs text-muted-foreground">
              {trip.createdAt ? new Date(trip.createdAt).toLocaleDateString('es-ES') : 'Recientemente'}
            </p>
          </div>
        </div>
        
        <h3 className="font-semibold text-lg mb-2" data-testid={`text-trip-title-${trip.id}`}>
          {trip.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4" data-testid={`text-trip-destination-${trip.id}`}>
          Descubre {trip.destination} en este increíble itinerario de {duration} días
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center text-muted-foreground" data-testid={`text-trip-duration-${trip.id}`}>
              <Calendar className="h-4 w-4 mr-1" />
              {duration} días
            </span>
            {budget > 0 && (
              <span className="flex items-center text-muted-foreground" data-testid={`text-trip-budget-${trip.id}`}>
                <DollarSign className="h-4 w-4 mr-1" />
                ${budget.toLocaleString()}
              </span>
            )}
          </div>
          
          {trip.rating && (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium" data-testid={`text-trip-rating-${trip.id}`}>
                {parseFloat(trip.rating).toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">(12)</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            className="flex-1"
            onClick={() => onSave?.(trip.id)}
            data-testid={`button-save-trip-${trip.id}`}
          >
            <Plus className="h-4 w-4 mr-1" />
            Añadir a mi viaje
          </Button>
          <Button
            variant="outline"
            size="icon"
            data-testid={`button-comment-trip-${trip.id}`}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
