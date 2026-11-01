import { useState, type FormEvent } from "react";

interface AuthResponse {
    message?: string;
    accessToken?: string;
}

export default function Main() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");

        if (isRegistering && password !== passwordConfirmation) {
            setMessage("Mật khẩu nhập lại không khớp.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(
                isRegistering ? "/auth/register" : "/auth/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                }
            );
            const data = (await response.json()) as AuthResponse;

            if (!response.ok) {
                throw new Error(data.message ?? "Yêu cầu không thành công.");
            }

            if (!isRegistering && data.accessToken) {
                localStorage.setItem("accessToken", data.accessToken);
            }

            setMessage(data.message ?? (isRegistering
                ? "Đăng ký thành công!"
                : "Đăng nhập thành công!"));
        } catch (error: unknown) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Không thể kết nối đến máy chủ."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function toggleMode() {
        setIsRegistering((current) => !current);
        setMessage("");
        setPasswordConfirmation("");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center w-3xs min-h-80 py-8 bg-blue-950 items-center rounded-2xl"
        >
            <div className="text-center text-2xl text-amber-50 mb-9">
                {isRegistering ? "Đăng ký" : "Đăng nhập"}
            </div>
            <input
                className="w-64 mb-5 border-2"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                autoComplete="email"
                placeholder="Email"
                required
            />
            <input
                className="w-64 border-2 mb-5"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                autoComplete={isRegistering ? "new-password" : "current-password"}
                placeholder="Mật khẩu"
                required
            />
            {isRegistering && (
                <input
                    className="w-64 border-2 mb-5"
                    value={passwordConfirmation}
                    onChange={(event) => setPasswordConfirmation(event.target.value)}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Nhập lại mật khẩu"
                    required
                />
            )}
            {message && (
                <p role="status" className="text-amber-50 mb-2">
                    {message}
                </p>
            )}
            <button
                type="submit"
                className="bg-red pt-2 mb-2"
                disabled={isSubmitting}
            >
                {isSubmitting
                    ? "Đang xử lý..."
                    : isRegistering
                        ? "Đăng ký"
                        : "Đăng nhập"}
            </button>
            <button
                type="button"
                className="bg-red pt-2"
                onClick={toggleMode}
                disabled={isSubmitting}
            >
                {isRegistering ? "Đã có tài khoản? Đăng nhập" : "Tạo tài khoản"}
            </button>
        </form>
    );
}
