import { useParams } from "react-router-dom";
import CreateDistributionTrip from "../../components/tripsDistribution/CreateDistributionTrip";
import EditDistributionTrip from "../../components/tripsDistribution/EditDistributionTrip";

export default function DistributionFormPage() {
    const {id} = useParams();
    const isEditing = !!id;

    return (
         <>
            {isEditing ? (
                <EditDistributionTrip tripId={id} />
            ) : (
                <CreateDistributionTrip />
            )}
        </>
    )
}