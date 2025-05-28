import { useNavigate } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";


export default function TripPage() {
    const navigate = useNavigate();


    return(
        <>
            <SectionHeader
                title="Viaje"
                description="Aquí puedes ver los detalles del viaje, incluyendo la información de los pasajeros, el itinerario y las reservas."
                buttonText="Nuevo viaje"
                onAdd={() => navigate('/trips/form')}
            />
        </>
    )
}