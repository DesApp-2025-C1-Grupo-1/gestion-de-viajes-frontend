import { useParams } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { Paper, Backdrop, CircularProgress} from "@mui/material";
import { useDepositForm } from "../../hooks/deposits/useDepositsForm";
import BasicInfoSection from "../../components/deposit/BasicInfoDeposit";
import LocationSection from "../../components/deposit/LocationDeposit";
import ContactSection from "../../components/deposit/ContactDeposit";
import FormActions from "../../components/deposit/FormActions";
import AdressSection from "../../components/deposit/AddressDeposit";
import TimeSection from "../../components/deposit/TimeSection";
import { CreateDepositoSchema } from "../../api/schemas";

export default function DepositFormPage() {
    const {id} = useParams();
    
    const {
        handleSubmit,
        isEditing,
        isLoading,
        formErrors,
        register,
        control,
        watch,
        isSubmitting,
        onSubmit
    } = useDepositForm(id);

    const handleFormSubmit = (data: CreateDepositoSchema) => {
        onSubmit(data);
    };
    if (isLoading ) return <CircularProgress />;

    return (
        <>
            <SectionHeader
                title={isEditing ? "Editar depósito" : "Registrar depósito"}
                description={isEditing ? "Actualizá los datos del depósito registrado." : "Completá el formulario para dar de alta un depósito."}
            />

            <Paper  sx={{ padding:4, mx:'auto', width:"100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7"}} >
                <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full max-w-[800px] mx-auto">
                    <BasicInfoSection 
                        errors={formErrors}
                        loading={isLoading}
                        register={register}
                        control={control}
                    />

                    <AdressSection 
                        errors={formErrors}
                        loading={isLoading}
                        register={register}
                    />
                    
                    <LocationSection 
                        errors={formErrors}
                        loading={isLoading}
                        register={register}
                    />
                    <ContactSection 
                        errors={formErrors}
                        loading={isLoading}
                        register={register}
                        watch={watch}
                    />
                    <TimeSection
                        errors={formErrors}
                        loading={isLoading}
                        register={register}
                        control={control}
                    />
                    
                    <FormActions 
                        loading={isLoading}
                        isEditing={isEditing}
                        isSubmitting={isSubmitting}
                    />
                </form>
                <Backdrop open={isLoading} sx={{ zIndex: 9999, color: "#fff" }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Paper>

        </>
    )
}