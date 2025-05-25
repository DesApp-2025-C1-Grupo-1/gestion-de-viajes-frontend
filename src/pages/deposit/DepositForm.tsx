import { useNavigate, useParams } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { Paper, Backdrop, CircularProgress} from "@mui/material";
import { useDepositForm } from "../../hooks/deposits/useDepositsForm";
import BasicInfoSection from "../../components/deposit/BasicInfoDeposit";
import LocationSection from "../../components/deposit/LocationDeposit";
import ContactSection from "../../components/deposit/ContactDeposit";
import FormActions from "../../components/deposit/FormActions";
import AdressSection from "../../components/deposit/AddressDeposit";
import TimeSection from "../../components/deposit/TimeSection";

export default function DepositFormPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    
    const {
        formData,
        errors,
        loading,
        touched,
        handleChange,
        handleSubmit,
        isEditing,
        handleSelectChange
    } = useDepositForm(id);

    return (
        <>
            <SectionHeader 
                title={isEditing ? "Editar depósito" : "Crear depósito"}
                description={isEditing ? "Modifica los datos del depósito" : "Aquí puedes registrar un nuevo depósito."}
            />

            <Paper  sx={{maxHeight:"90%", padding:4, overflow:"auto", mx:'auto', width:"100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7", pb: 5} } >
                <form onSubmit={handleSubmit} className="w-full max-w-[800px] mx-auto">
                    <BasicInfoSection 
                        formData={formData}
                        errors={errors}
                        touched={touched}
                        loading={loading}
                        handleChange={handleChange}
                        handleSelectChange={handleSelectChange}
                    />

                    <AdressSection 
                        formData={formData}
                        errors={errors}
                        touched={touched}
                        loading={loading}
                        handleChange={handleChange}
                        handleSelectChange={handleSelectChange}
                    />
                    
                    <LocationSection 
                        formData={formData}
                        errors={errors}
                        touched={touched}
                        loading={loading}
                        handleChange={handleChange}
                    />
                    <ContactSection 
                        formData={formData}
                        errors={errors}
                        touched={touched}
                        loading={loading}
                        handleChange={handleChange}
                    />
                    <TimeSection
                        formData={formData}
                        errors={errors}
                        touched={touched}
                        loading={loading}
                        handleChange={handleChange}
                    />
                    
                    <FormActions 
                        loading={loading}
                        isEditing={isEditing}
                        onCancel={() => navigate("/depots")}
                    />
                </form>
                <Backdrop open={loading} sx={{ zIndex: 9999, color: "#fff" }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Paper>

        </>
    )
}