import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommunityCard from "@/components/community-card";
import { Users, TrendingUp, MessageSquare, ThumbsUp, Calendar, DollarSign, Star, Plus, MessageCircle } from "lucide-react";

export default function Community() {
  const [activeTab, setActiveTab] = useState("itinerarios");

  // Get public trips
  const { data: publicTrips, isLoading: tripsLoading } = useQuery({
    queryKey: ['/api/trips/public'],
  });

  // Mock reviews data (replace with real API call)
  const mockReviews = [
    {
      id: "1",
      userName: "Laura Jiménez",
      userAvatar: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40",
      rating: 5,
      targetName: "Hotel Le Marais",
      comment: "Excelente ubicación en el corazón de París. El personal fue muy amable y las habitaciones están perfectamente equipadas. Definitivamente lo recomiendo para estadías cortas.",
      helpful: 12,
      createdAt: "Hace 2 días"
    },
    {
      id: "2", 
      userName: "Diego Pérez",
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40",
      rating: 4,
      targetName: "Torre Eiffel",
      comment: "Imprescindible visitar París. Recomiendo ir temprano para evitar las multitudes. La vista desde arriba es espectacular, especialmente al atardecer.",
      helpful: 8,
      createdAt: "Hace 5 días"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2" data-testid="text-community-title">
          <Users className="h-8 w-8 text-primary" />
          Comunidad de Viajeros
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid="text-community-subtitle">
          Descubre itinerarios reales y obtén consejos de otros viajeros
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-stat-trips">240+</p>
                <p className="text-xs text-muted-foreground">Itinerarios</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-stat-users">1.2k</p>
                <p className="text-xs text-muted-foreground">Viajeros</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-stat-reviews">850+</p>
                <p className="text-xs text-muted-foreground">Reseñas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-stat-rating">4.8</p>
                <p className="text-xs text-muted-foreground">Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="itinerarios" data-testid="tab-itinerarios">Itinerarios Populares</TabsTrigger>
          <TabsTrigger value="reseñas" data-testid="tab-reseñas">Reseñas Recientes</TabsTrigger>
          <TabsTrigger value="contribuciones" data-testid="tab-contribuciones">Mis Contribuciones</TabsTrigger>
        </TabsList>

        <TabsContent value="itinerarios" className="space-y-6">
          {tripsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicTrips?.length > 0 ? (
                publicTrips.map((trip: any) => (
                  <CommunityCard key={trip.id} trip={trip} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2" data-testid="text-no-trips-title">
                        No hay itinerarios públicos aún
                      </h3>
                      <p className="text-muted-foreground mb-4" data-testid="text-no-trips-subtitle">
                        Sé el primero en compartir tu experiencia de viaje con la comunidad
                      </p>
                      <Button data-testid="button-share-trip">
                        <Plus className="h-4 w-4 mr-2" />
                        Compartir Itinerario
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reseñas" className="space-y-4">
          <div className="space-y-4">
            {mockReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={review.userAvatar} 
                      alt="User profile" 
                      className="w-10 h-10 rounded-full object-cover"
                      data-testid={`img-reviewer-${review.id}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="font-medium" data-testid={`text-reviewer-name-${review.id}`}>
                          {review.userName}
                        </p>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`text-sm ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground" data-testid={`text-review-target-${review.id}`}>
                          {review.targetName}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2" data-testid={`text-review-comment-${review.id}`}>
                        {review.comment}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span data-testid={`text-review-date-${review.id}`}>{review.createdAt}</span>
                        <Button variant="ghost" size="sm" className="h-auto p-0" data-testid={`button-reply-${review.id}`}>
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Responder
                        </Button>
                        <Button variant="ghost" size="sm" className="h-auto p-0" data-testid={`button-helpful-${review.id}`}>
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {review.helpful}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contribuciones">
          <div className="text-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2" data-testid="text-no-contributions-title">
                  Aún no has contribuido
                </h3>
                <p className="text-muted-foreground mb-4" data-testid="text-no-contributions-subtitle">
                  Comparte tus experiencias de viaje para ayudar a otros viajeros
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button data-testid="button-share-itinerary">
                    <Plus className="h-4 w-4 mr-2" />
                    Compartir Itinerario
                  </Button>
                  <Button variant="outline" data-testid="button-write-review">
                    <Star className="h-4 w-4 mr-2" />
                    Escribir Reseña
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
