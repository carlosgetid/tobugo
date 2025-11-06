import { useLocation, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Home, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PaymentFailure() {
  const [, setLocation] = useLocation();

  const urlParams = new URLSearchParams(window.location.search);
  const externalReference = urlParams.get("external_reference");
  
  // Extract tripId from external reference (format: tobugo-{tripId}-{userId}-{timestamp})
  // TripId is a UUID with 5 segments (8-4-4-4-12 characters)
  const tripId = externalReference 
    ? externalReference.replace("tobugo-", "").split("-").slice(0, 5).join("-")
    : null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full" data-testid="card-payment-failure">
        <CardContent className="pt-12 pb-8 text-center space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-12 w-12 text-red-600" data-testid="icon-error" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold" data-testid="text-failure-title">
              Pago No Completado
            </h1>
            <p className="text-muted-foreground">
              Tu pago no pudo ser procesado
            </p>
          </div>

          <Separator />

          {/* Possible Reasons */}
          <div className="bg-muted p-4 rounded-lg text-left space-y-2">
            <h3 className="font-semibold text-sm">Posibles razones:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Fondos insuficientes</li>
              <li>• Tarjeta rechazada</li>
              <li>• Datos incorrectos</li>
              <li>• Pago cancelado manualmente</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {tripId && (
              <Button
                onClick={() => setLocation(`/itinerarios?tripId=${tripId}`)}
                className="w-full"
                size="lg"
                data-testid="button-retry"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Intentar
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="w-full"
              data-testid="button-home"
            >
              <Home className="h-4 w-4 mr-2" />
              Volver al Inicio
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            ¿Necesitas ayuda? Contáctanos en soporte@tobugo.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
