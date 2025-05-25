import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotify } from "./useNotify";
import {
  EmpresaDto,
  TipoVehiculoDto,
  useVehiculoControllerFindOne,
  vehiculoControllerCreate,
  vehiculoControllerUpdate,
  CreateVehiculoDto,
  UpdateVehiculoDto,
} from "../api/generated";

type VehiculoFormData = {
  _id?: string;
  patente: string;
  modelo: string;
  marca: string;
  tipo?: TipoVehiculoDto;
  empresa?: EmpresaDto;
  año: number;
  peso_carga: number;
  volumen_carga: number;
};

export const useVehicleForm = (id?: string) => {
  const navigate = useNavigate();
  const isEditing = !!id;
  const [formData, setFormData] = useState<VehiculoFormData>({
    patente: "",
    modelo: "",
    marca: "",
    tipo: undefined,
    empresa: undefined,
    año: new Date().getFullYear(),
    peso_carga: 0,
    volumen_carga: 0,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { data } = useVehiculoControllerFindOne(id!, { query: { enabled: isEditing } });
  const { notify } = useNotify("Vehículo");

  useEffect(() => {
    if (isEditing && data?.data) {
      setFormData(data.data);
    }
  }, [isEditing, data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    const parsedValue =
      e.target instanceof HTMLInputElement && e.target.type === "number"
        ? Number(value)
        : value;

    setFormData((prev) => ({ ...prev, [name!]: parsedValue }));
    setTouched((prev) => ({ ...prev, [name!]: true }));
    validateField(name!, parsedValue);
  };

  const validateField = (name: string, value: any): string => {
    let error = "";

    switch (name) {
      case "patente":
        if (!value || typeof value !== "string" || value.trim().length < 6) {
          error = "Debe tener al menos 6 caracteres.";
        }
        break;
      case "modelo":
      case "marca":
        if (!value || typeof value !== "string" || value.trim().length < 3) {
          error = "Debe tener al menos 3 caracteres.";
        }
        break;
      case "tipo":
        if (!value) {
          error = "Debe seleccionar un tipo de vehículo.";
        }
        break;
      case "empresa":
        if (!value) {
          error = "Debe seleccionar una empresa.";
        }
        break;
      case "año":
        if (!value || isNaN(value) || value < 1900 || value > 2025) {
          error = "Debe estar entre 1900 y 2025.";
        }
        break;
      case "peso_carga":
      case "volumen_carga":
        if (!value || isNaN(value) || value <= 0) {
          error = "Debe ser mayor a 0.";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const validateAll = (): boolean => {
    const fieldsToValidate: (keyof VehiculoFormData)[] = [
      "patente",
      "modelo",
      "marca",
      "tipo",
      "empresa",
      "año",
      "peso_carga",
      "volumen_carga",
    ];

    const newTouched = fieldsToValidate.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(newTouched);

    const newErrors: Record<string, string> = {};
    for (const field of fieldsToValidate) {
      const value = formData[field];
      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmpresaChange = (empresa: EmpresaDto) => {
    setFormData((prev) => ({ ...prev, empresa }));
    setTouched((prev) => ({ ...prev, empresa: true }));
    validateField("empresa", empresa);
  };

  const handleTipoChange = (tipo: TipoVehiculoDto) => {
    setFormData((prev) => ({ ...prev, tipo }));
    setTouched((prev) => ({ ...prev, tipo: true }));
    validateField("tipo", tipo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isValid = validateAll();
    if (!isValid) {
      setLoading(false);
      return;
    }

    const payload = {
      patente: formData.patente,
      modelo: formData.modelo,
      marca: formData.marca,
      año: formData.año,
      peso_carga: formData.peso_carga,
      volumen_carga: formData.volumen_carga,
      empresa: formData.empresa!._id,
      tipo: formData.tipo!._id,
    };

    try {
      if (isEditing) {
        await vehiculoControllerUpdate(id!, payload as UpdateVehiculoDto);
        notify("update");
      } else {
        await vehiculoControllerCreate(payload as CreateVehiculoDto);
        notify("create");
      }
      navigate("/vehicles");
    } catch (e) {
      const error = e as { response?: { data?: { message?: string } } };
      if (error.response?.data?.message) {
        notify("error", error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    errors,
    touched,
    handleChange,
    handleEmpresaChange,
    handleTipoChange,
    handleSubmit,
    isEditing,
  };
};
