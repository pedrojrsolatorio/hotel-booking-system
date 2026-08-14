import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="mb-6">
                <h2 className="font-display text-2xl text-ink">Create an account</h2>
                <p className="mt-2 text-sm text-sage">Set up your account to manage bookings and store preferences.</p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" className="text-charcoal" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 w-full rounded-md border-hairline text-charcoal shadow-sm focus:border-brass focus:ring-brass"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2 text-burgundy" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" className="text-charcoal" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 w-full rounded-md border-hairline text-charcoal shadow-sm focus:border-brass focus:ring-brass"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2 text-burgundy" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className="text-charcoal"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 w-full rounded-md border-hairline text-charcoal shadow-sm focus:border-brass focus:ring-brass"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 text-burgundy"
                    />
                </div>

                <div className="mt-6 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="text-sm text-charcoal/80 underline hover:text-brass focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4 bg-ink text-ivory hover:bg-charcoal" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
