import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Home, List } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();

  // Get payment info from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const paymentId = urlParams.get("payment_id");
  const externalReference = urlParams.get("external_reference");
  const status = urlParams.get("status");

  // Extract tripId from external reference (format: tobugo-{tripId}-{userId}-{timestamp})
  // TripId is a UUID with 5 segments (8-4-4-4-12 characters)
  const tripId = externalReference 
    ? externalReference.replace("tobugo-", "").split("-").slice(0, 5).join("-")
    : null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full" data-testid="card-payment-success">
        <CardContent className="pt-12 pb-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" data-testid="icon-success" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold" data-testid="text-success-title">
              ¡Pago Completado!
            </h1>
            <p className="text-muted-foreground">
              Tu compra se procesó exitosamente
            </p>
          </div>

          <Separator />

          {/* Payment Details */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado</span>
              <span className="font-medium text-green-600" data-testid="text-payment-status">
                {status === "approved" ? "Aprobado" : "Procesando"}
              </span>
            </div>
            {paymentId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID de Pago</span>
                <span className="font-mono text-xs" data-testid="text-payment-id">
                  {paymentId}
                </span>
              </div>
            )}
            {externalReference && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Referencia</span>
                <span className="font-mono text-xs" data-testid="text-external-reference">
                  {externalReference}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* Next Steps */}
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg text-left space-y-2">
              <h3 className="font-semibold text-sm">Próximos pasos:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓Recibirás un email de confirmación</li>
                <li>✓ Ya puedes descargar tu itinerario en PDF</li>
                <li>✓ Acceso ilimitado a futuras descargas</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {tripId && (
                <Button
                  onClick={() => setLocation(`/itinerarios?tripId=${tripId}`)}
                  className="w-full"
                  size="lg"
                  data-testid="button-view-itinerary"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Ver y Descargar Itinerario
                </Button>
              )}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setLocation("/")}
                  className="flex-1"
                  data-testid="button-home"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Inicio
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/dashboard?tab=purchases")}
                  className="flex-1"
                  data-testid="button-history"
                >
                  <List className="h-4 w-4 mr-2" />
                  Mis Compras
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
