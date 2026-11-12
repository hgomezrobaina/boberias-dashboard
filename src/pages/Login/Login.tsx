import { supabase } from "@/lib/supabase";
import Button from "@/ui/components/Button/Button";
import Card from "@/ui/components/Card/Card";
import FormInput from "@/ui/components/FormInput/FormInput";
import Input from "@/ui/components/Input/Input";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    setLoading(true);

    supabase.auth
      .signInWithPassword({
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.error !== null) {
          toast.error("Hubo un error al autenticarse");
        } else {
          navigate("/");
        }
      })
      .catch(() => {
        toast.error("Hubo un error al autenticarse");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full h-dvh flex items-center justify-center bg-gray-50">
      <Card
        width={480}
        title="Autenticación"
        description="Inserta tu usuario y contraseña para entrar al sistema"
        footer={
          <>
            <Button
              full
              type="submit"
              size="default"
              onClick={handleSubmit}
              loading={loading}
            >
              Autenticarse
            </Button>
          </>
        }
      >
        <FormInput label="Email">
          <Input value={{ value: email, onChange: setEmail }} />
        </FormInput>

        <FormInput label="Contraseña">
          <Input
            type="password"
            value={{ onChange: setPassword, value: password }}
          />
        </FormInput>
      </Card>
    </div>
  );
}
