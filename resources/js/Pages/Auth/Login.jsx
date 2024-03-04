import {useEffect, useState} from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    }),
    handleChange = (e) => { // Set new data to state
        const { name, value } = e.target;
        setData(prevState => ({
            ...prevState,
            [name]: value
        }));
    },
    [errorsMgs, setErrorsMgs] = useState(''), // To check for errors in the form, when onBlur
    handleBlur=()=>{ // A method for checking errors in a form and displaying error messages at the bottom of the form
        if( // Checking the size of the email value, as well as the presence of email characters
            data.email.length<6 // For ex.: w@g.cc - 6 symbols
            || !/[A-z.@]/.test(data.email) // Checking for valid email characters
            || /[!"#$%^&*)(+=}\]\[{';:?/>,<]/.test(data.email) // Checking for invalid email characters
        ){
            setErrorsMgs('Check email address');
            return
        }
        if( // Password verification
            data.password.length<8 // The minimum number of characters when registering is 8
            || !/[A-z0-9/\\!';\[\]@`~#$%^&*(),.?":{}|<>_+=-]/.test(data.password) // Checking for a match to at least one of the characters, as in the password entry registration field
        ){
            setErrorsMgs('Check password');
            return
        }
        setErrorsMgs('');
    }

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = e => {
        e.preventDefault();
        post(route('login'));
    };
    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        /*type="email"*/
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        // isFocused={true}
                        onChange={ handleChange }
                        onBlur={ handleBlur }
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={ handleChange }
                        onBlur={ handleBlur }
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={ (e) => setData('remember', e.target.checked) }
                        />
                        <span className="ms-2 text-sm text-gray-600">Remember me</span>
                    </label>
                </div>
                {(errorsMgs.length>0) && <p className={'alertMgsAnm mt-2 border-2 border-rose-500 rounded-md text-sm dark:text-gray-600 p-4'}>{errorsMgs}</p>}

                <div className="flex items-center justify-between flex-wrap gap-1 mt-4">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <Link
                        href={route('register')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Don't have an account?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
