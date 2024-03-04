import { useEffect, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => { // Reset form pass and pass_conf
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const [passwordError, setPasswordError] = useState([new Object({msg:'', secondVal: 0})]), // To check the password value
        handleChange = (e) => { // Set new data to state
            const { name, value } = e.target;
            if(name==='password'){
                handleCheck(value)
            }
            setData(prevState => ({
                ...prevState,
                [name]: value
            }));
        },
        handleSubmit = e => { // Checking the password value for compliance with the terms of reference
            e.preventDefault();
            if(data.password!==data.password_confirmation){
                setPasswordError({msg: 'Password and password confirmation do not match',secondVal:1});
                return;
            }else{
                setPasswordError({msg: '',secondVal:0});
            }
            post(route('register'));
        },
        handleCheck = value => { // Checking the password value for compliance with the terms of reference (and a little more...)

            // Checking for special characters in the password
            const  specialChars_NUM = /[0-9]/ // Numbers
                 , specialChars_AZ = /[A-Z]/ // Capital letters
                 , specialChars_SPEC = /[/\\!';\[\]@`~#$%^&*(),.?":{}|<>_+=-]/ // Special character
                 , specialChars_az = /[a-z]/ // Lowercase letter
                 , specialChars_RU = /[А-я]/ // Excluding Russian characters
                 , specialChars_Space = /\s/ // Excluding spaces
            if(value.length<9){ // Check length (min: 8 symbols)
                setPasswordError({msg: 'The password must be at least 8 characters long',secondVal:0});
                return;
            }else if (!specialChars_NUM.test(value)) { // Check Numbers
                setPasswordError({msg: 'The password must contain at least one number',secondVal:0});
                return;
            }else if(!specialChars_AZ.test(value)){ // Check Capital letters
                setPasswordError({msg:'The password must contain at least one capital letter',secondVal:0});
                return;
            }else if(!specialChars_az.test(value)){ // Check Lowercase letter
                setPasswordError({msg:'The password must contain at least one lowercase letter',secondVal:0});
                return;
            }else if(!specialChars_SPEC.test(value)){ // Check Special character
                setPasswordError({msg:'The password must contain at least one special character (_=+#@!)',secondVal:0});
                return;
            }else if(specialChars_RU.test(value)){ // Check Russian characters
                setPasswordError({msg:'The password must not contain Russian characters',secondVal:0});
                return;
            }else if(specialChars_Space.test(value)){ // Check spaces
                setPasswordError({msg:'The password must not contain spaces',secondVal:0});
                return;
            }else{
                setPasswordError({msg:'',secondVal:0});
            }
        };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={handleSubmit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        placeholder="Type your Name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={handleChange}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email"/>

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Type your Email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={handleChange}
                        required
                    />
                    <span className={'border-l-4 border-indigo-400 dark:text-gray-600 flex flex-col p-4'}>
                        Please enter your existing and valid email
                        <br/><i><strong>For example:</strong> mymail@mail.com</i>
                    </span>
                    <InputError message={errors.email} className="mt-2"/>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password"/>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Type your password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={handleChange}
                        required
                    />
                    {passwordError.msg && passwordError.secondVal===0 && <p className={'alertMgsAnm border-l-4 text-sm dark:text-gray-600 p-4'}>{passwordError.msg}</p>}
                    <span className={'border-l-4 border-indigo-400 dark:text-gray-600 flex flex-col p-4'}>
                        The password must contain characters in different cases, numbers, special characters.
                        <br/><i><strong>For example:</strong> A-Z, a-z, 0-9, +_() ...</i>
                    </span>

                    <InputError message={errors.password} className="mt-2"/>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        placeholder="Retype your password"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={handleChange}
                        required
                    />
                    {passwordError.msg && passwordError.secondVal===1 && <p className={'alertMgsAnm border-l-4 text-sm dark:text-gray-600 p-4'}>{passwordError.msg}</p>}
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route('login')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4"> Register </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
