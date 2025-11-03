// SignupPage.tsx
import z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";
import profileImage from "../../public/profile.jpg"; // ✅ 여기에 고정 이미지 경로 (직접 추가)

// -------------------- Zod Schema --------------------
const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하이어야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하이어야 합니다." }),
    name: z.string().min(1, { message: "이름을 입력해 주세요." }),
  })
  .refine((d) => d.password === d.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;
type Step = 1 | 2 | 3;

// -------------------- Password Field --------------------
const PasswordField = ({
  register,
  name,
  placeholder,
  error,
  autoComplete = "new-password",
}: {
  register: ReturnType<typeof useForm<FormFields>>["register"];
  name: "password" | "passwordCheck";
  placeholder: string;
  error?: string;
  autoComplete?: string;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        {...register(name)}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`border w-full p-[10px] pr-11 focus:border-[#807bff] rounded-sm ${
          error ? "border-red-500 bg-red-200" : "border-gray-300"
        }`}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1"
      >
        {show ? "🙈" : "👁️"}
      </button>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

// -------------------- SignupPage --------------------
const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    trigger,
    watch,
    setFocus,
    setError,
    clearErrors,
  } = useForm<FormFields>({
    defaultValues: { email: "", password: "", passwordCheck: "", name: "" },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (step === 1) setFocus("email");
    if (step === 2) setFocus("password");
    if (step === 3) setFocus("name");
  }, [step, setFocus]);

  // -------------------- Submit --------------------
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordCheck, ...rest } = data;
    try {
      await postSignup(rest);
      alert("🎉 회원가입이 완료되었습니다!");
      navigate("/", { replace: true });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        const msg =
          (e.response?.data as any)?.message ||
          (e.response?.data as any)?.error ||
          e.message;
        if (status === 409) {
          setStep(1);
          setError("email", {
            type: "server",
            message: msg || "이미 사용 중인 이메일입니다.",
          });
          setFocus("email");
          return;
        }
      }
    }
  };

  // -------------------- Email Check --------------------
  const goNextFromEmail = async () => {
    const ok = await trigger(["email"]);
    if (!ok) return;

    const email = watch("email");
    setCheckingEmail(true);

    try {
      await axios.post("http://localhost:8000/v1/auth/signup/check", { email });
      clearErrors("email");
      setStep(2);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 409) {
        setError("email", {
          type: "server",
          message: "이미 사용 중인 이메일입니다.",
        });
        setFocus("email");
      } else {
        clearErrors("email");
        setStep(2);
      }
    } finally {
      setCheckingEmail(false);
    }
  };

  const goNextFromPassword = async () => {
    const ok = await trigger(["password", "passwordCheck"]);
    if (ok) setStep(3);
  };

  const goPrev = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

  const v = watch();
  const canNextEmail = !!v.email && !errors.email;
  const canNextPassword =
    !!v.password &&
    !!v.passwordCheck &&
    !errors.password &&
    !errors.passwordCheck;
  const canSubmit = !!v.name && !errors.name && isValid;

  // -------------------- JSX --------------------
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center h-full gap-4"
    >
      <div className="flex flex-col gap-3 w-[300px]">
        <div className="text-sm text-gray-400 mb-1">
          {step === 1 && "1/3 · 이메일 입력"}
          {step === 2 && "2/3 · 비밀번호 설정"}
          {step === 3 && "3/3 · 이름 · 프로필"}
        </div>

        {/* STEP 1: 이메일 */}
        {step === 1 && (
          <>
            <input
              {...register("email")}
              type="email"
              placeholder="이메일"
              className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm ${
                errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <div className="text-red-500 text-sm">{errors.email.message}</div>
            )}
            <button
              type="button"
              onClick={goNextFromEmail}
              disabled={!canNextEmail || checkingEmail}
              className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 disabled:bg-gray-300"
            >
              {checkingEmail ? "확인 중..." : "다음"}
            </button>
          </>
        )}

        {/* STEP 2: 비밀번호 */}
        {step === 2 && (
          <>
            <PasswordField
              register={register}
              name="password"
              placeholder="비밀번호 (8~20자)"
              error={errors.password?.message}
            />
            <PasswordField
              register={register}
              name="passwordCheck"
              placeholder="비밀번호 확인"
              error={errors.passwordCheck?.message}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={goPrev}
                className="w-1/3 bg-gray-200 py-3 rounded-md text-lg font-medium"
              >
                이전
              </button>
              <button
                type="button"
                onClick={goNextFromPassword}
                disabled={!canNextPassword}
                className="w-2/3 bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 disabled:bg-gray-300"
              >
                다음
              </button>
            </div>
          </>
        )}

        {/* STEP 3: 이름 + 고정 프로필 이미지 */}
        {step === 3 && (
          <>
            {/* ✅ 고정 이미지 표시 */}
            <div className="flex flex-col items-center gap-3 mb-4">
              <img
                src={profileImage}
                alt="프로필 이미지"
                className="w-28 h-28 rounded-full object-cover ring-1 ring-gray-300"
              />
            </div>

            <input
              {...register("name")}
              type="text"
              placeholder="이름"
              className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm ${
                errors?.name ? "border-red-500 bg-red-200" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <div className="text-red-500 text-sm">{errors.name.message}</div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={goPrev}
                className="w-1/3 bg-gray-200 text-gray-800 py-3 rounded-md text-lg font-medium"
              >
                이전
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !canSubmit}
                className="w-2/3 bg-pink-600 text-white py-3 rounded-md text-lg font-medium hover:bg-pink-700 disabled:bg-gray-300"
              >
                회원가입 완료
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default SignupPage;
