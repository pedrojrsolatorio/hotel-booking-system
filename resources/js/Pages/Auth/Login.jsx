import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <div className="mb-6">
                <h2 className="font-display text-2xl text-ink">Sign in to your account</h2>
                <p className="mt-2 text-sm text-sage">Use your registered email to access your bookings and preferences.</p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-charcoal" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 w-full rounded-md border-hairline text-charcoal shadow-sm focus:border-brass focus:ring-brass"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2 text-burgundy" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" className="text-charcoal" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 w-full rounded-md border-hairline text-charcoal shadow-sm focus:border-brass focus:ring-brass"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2 text-burgundy" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-charcoal">Remember me</span>
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-charcoal/80 underline hover:text-brass focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4 bg-ink text-ivory hover:bg-charcoal" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>

                <div className="mt-6 text-center text-sm">
                    <Link href={route('register')} className="text-charcoal/80 underline hover:text-brass">Create an account</Link>
                </div>
            </form>
        </GuestLayout>
    );
}
