import {
    memo,
    ReactNode,
    useState,
    ChangeEvent,
    FormEvent,
    useEffect,
    useRef,
    forwardRef,
} from 'react';
import {
    motion,
    useAnimation,
    useInView,
    useMotionTemplate,
    useMotionValue,
} from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

// ==================== Input Component ====================
const AnimatedInput = memo(
    forwardRef(function AnimatedInput(
        { className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>,
        ref: React.ForwardedRef<HTMLInputElement>
    ) {
        const radius = 100;
        const [visible, setVisible] = useState(false);
        const mouseX = useMotionValue(0);
        const mouseY = useMotionValue(0);

        function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
            const { left, top } = currentTarget.getBoundingClientRect();
            mouseX.set(clientX - left);
            mouseY.set(clientY - top);
        }

        return (
            <motion.div
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              ${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
              #3b82f6,
              transparent 80%
            )
          `,
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                className="group/input rounded-lg p-[2px] transition duration-300"
            >
                <input
                    type={type}
                    className={cn(
                        `shadow-input dark:placeholder-text-neutral-600 flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600`,
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </motion.div>
        );
    })
);
AnimatedInput.displayName = 'AnimatedInput';

// ==================== BoxReveal ====================
type BoxRevealProps = {
    children: ReactNode;
    width?: string;
    boxColor?: string;
    duration?: number;
    overflow?: string;
    position?: string;
    className?: string;
};

const BoxReveal = memo(function BoxReveal({
    children,
    width = 'fit-content',
    boxColor,
    duration,
    overflow = 'hidden',
    position = 'relative',
    className,
}: BoxRevealProps) {
    const mainControls = useAnimation();
    const slideControls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            slideControls.start('visible');
            mainControls.start('visible');
        } else {
            slideControls.start('hidden');
            mainControls.start('hidden');
        }
    }, [isInView, mainControls, slideControls]);

    return (
        <section
            ref={ref}
            style={{ position: position as any, width, overflow }}
            className={className}
        >
            <motion.div
                variants={{ hidden: { opacity: 0, y: 75 }, visible: { opacity: 1, y: 0 } }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: duration ?? 0.5, delay: 0.25 }}
            >
                {children}
            </motion.div>
            <motion.div
                variants={{ hidden: { left: 0 }, visible: { left: '100%' } }}
                initial="hidden"
                animate={slideControls}
                transition={{ duration: duration ?? 0.5, ease: 'easeIn' }}
                style={{ position: 'absolute', top: 4, bottom: 4, left: 0, right: 0, zIndex: 20, background: boxColor ?? '#5046e6', borderRadius: 4 }}
            />
        </section>
    );
});

// ==================== Ripple ====================
type RippleProps = {
    mainCircleSize?: number;
    mainCircleOpacity?: number;
    numCircles?: number;
    className?: string;
};

const Ripple = memo(function Ripple({
    mainCircleSize = 210,
    mainCircleOpacity = 0.24,
    numCircles = 8,
    className = '',
}: RippleProps) {
    return (
        <section
            className={`absolute inset-0 flex items-center justify-center bg-transparent [mask-image:linear-gradient(to_bottom,black,transparent)] ${className}`}
        >
            {Array.from({ length: numCircles }, (_, i) => {
                const size = mainCircleSize + i * 70;
                const opacity = mainCircleOpacity - i * 0.03;
                const animationDelay = `${i * 0.06}s`;
                return (
                    <span
                        key={i}
                        className="absolute animate-ripple rounded-full border border-foreground/10 bg-foreground/5"
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            opacity: Math.max(opacity, 0),
                            animationDelay,
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                );
            })}
        </section>
    );
});

// ==================== OrbitingCircles ====================
type OrbitingCirclesProps = {
    className?: string;
    children: ReactNode;
    reverse?: boolean;
    duration?: number;
    delay?: number;
    radius?: number;
    path?: boolean;
};

const OrbitingCircles = memo(function OrbitingCircles({
    className,
    children,
    reverse = false,
    duration = 20,
    delay = 10,
    radius = 50,
    path = true,
}: OrbitingCirclesProps) {
    return (
        <>
            {path && (
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="pointer-events-none absolute inset-0 size-full">
                    <circle className="stroke-black/10 stroke-1 dark:stroke-white/10" cx="50%" cy="50%" r={radius} fill="none" />
                </svg>
            )}
            <section
                style={{ '--duration': duration, '--radius': radius, '--delay': -delay } as React.CSSProperties}
                className={cn(
                    'absolute flex size-full transform-gpu animate-orbit items-center justify-center rounded-full border bg-black/10 [animation-delay:calc(var(--delay)*1000ms)] dark:bg-white/10',
                    { '[animation-direction:reverse]': reverse },
                    className
                )}
            >
                {children}
            </section>
        </>
    );
});

// ==================== Tech Icons for orbit display ====================
function MonitoringIcon() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    );
}
function CloudIcon() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        </svg>
    );
}
function ShieldIcon() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );
}
function AlertIcon() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-400">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}

// ==================== Label ====================
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    htmlFor?: string;
}

const Label = memo(function Label({ className, ...props }: LabelProps) {
    return (
        <label
            className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
            {...props}
        />
    );
});

// ==================== BottomGradient ====================
const BottomGradient = () => (
    <>
        <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
);

// ==================== AnimatedForm ====================
type FieldType = 'text' | 'email' | 'password';
type Field = {
    label: string;
    required?: boolean;
    type: FieldType;
    placeholder?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
type AnimatedFormProps = {
    header: string;
    subHeader?: string;
    fields: Field[];
    submitButton: string;
    textVariantButton?: string;
    errorField?: string;
    fieldPerRow?: number;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    googleLogin?: string;
    goTo?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};
type Errors = { [key: string]: string };

const AnimatedForm = memo(function AnimatedForm({
    header,
    subHeader,
    fields,
    submitButton,
    textVariantButton,
    errorField,
    fieldPerRow = 1,
    onSubmit,
    googleLogin,
    goTo,
}: AnimatedFormProps) {
    const [visible, setVisible] = useState<boolean>(false);
    const [errors, setErrors] = useState<Errors>({});

    const toggleVisibility = () => setVisible(!visible);

    const validateForm = (event: FormEvent<HTMLFormElement>) => {
        const currentErrors: Errors = {};
        fields.forEach((field) => {
            const value = (event.target as HTMLFormElement)[field.label]?.value;
            if (field.required && !value) currentErrors[field.label] = `${field.label} is required`;
            if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) currentErrors[field.label] = 'Invalid email address';
            if (field.type === 'password' && value && value.length < 6) currentErrors[field.label] = 'Password must be at least 6 characters';
        });
        return currentErrors;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formErrors = validateForm(event);
        if (Object.keys(formErrors).length === 0) {
            onSubmit(event);
        } else {
            setErrors(formErrors);
        }
    };

    return (
        <section className="max-md:w-full flex flex-col gap-4 w-96 mx-auto">
            <BoxReveal boxColor="var(--color-primary)" duration={0.3}>
                <h2 className="font-bold text-3xl text-foreground">{header}</h2>
            </BoxReveal>

            {subHeader && (
                <BoxReveal boxColor="var(--color-primary)" duration={0.3} className="pb-2">
                    <p className="text-muted-foreground text-sm max-w-sm">{subHeader}</p>
                </BoxReveal>
            )}

            {googleLogin && (
                <>
                    <BoxReveal boxColor="var(--color-primary)" duration={0.3} overflow="visible" width="unset">
                        <button
                            className="group/btn bg-background w-full rounded-md border border-border h-10 font-medium outline-hidden hover:cursor-pointer hover:bg-muted transition-colors"
                            type="button"
                            onClick={() => console.log('Google login clicked')}
                        >
                            <span className="flex items-center justify-center w-full h-full gap-3 text-foreground">
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                {googleLogin}
                            </span>
                            <BottomGradient />
                        </button>
                    </BoxReveal>

                    <BoxReveal boxColor="var(--color-primary)" duration={0.3} width="100%">
                        <section className="flex items-center gap-4">
                            <hr className="flex-1 border-dashed border-border" />
                            <p className="text-muted-foreground text-sm">or</p>
                            <hr className="flex-1 border-dashed border-border" />
                        </section>
                    </BoxReveal>
                </>
            )}

            <form onSubmit={handleSubmit}>
                <section className={`grid grid-cols-1 mb-4`}>
                    {fields.map((field) => (
                        <section key={field.label} className="flex flex-col gap-2 mb-4">
                            <BoxReveal boxColor="var(--color-primary)" duration={0.3}>
                                <Label htmlFor={field.label}>
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </Label>
                            </BoxReveal>
                            <BoxReveal width="100%" boxColor="var(--color-primary)" duration={0.3} className="flex flex-col space-y-2 w-full">
                                <section className="relative">
                                    <AnimatedInput
                                        type={field.type === 'password' ? (visible ? 'text' : 'password') : field.type}
                                        id={field.label}
                                        placeholder={field.placeholder}
                                        onChange={field.onChange}
                                    />
                                    {field.type === 'password' && (
                                        <button
                                            type="button"
                                            onClick={toggleVisibility}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                        >
                                            {visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                        </button>
                                    )}
                                </section>
                                <section className="h-4">
                                    {errors[field.label] && <p className="text-red-500 text-xs">{errors[field.label]}</p>}
                                </section>
                            </BoxReveal>
                        </section>
                    ))}
                </section>

                <BoxReveal width="100%" boxColor="var(--color-primary)" duration={0.3}>
                    {errorField && <p className="text-red-500 text-sm mb-4">{errorField}</p>}
                </BoxReveal>

                <BoxReveal width="100%" boxColor="var(--color-primary)" duration={0.3} overflow="visible">
                    <button
                        className="bg-gradient-to-br relative group/btn from-primary dark:from-primary dark:to-primary/80 to-primary/80 block w-full text-primary-foreground rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_rgba(255,255,255,0.2)_inset] outline-hidden hover:cursor-pointer hover:opacity-90 transition-opacity"
                        type="submit"
                    >
                        {submitButton} &rarr;
                        <BottomGradient />
                    </button>
                </BoxReveal>

                {textVariantButton && goTo && (
                    <BoxReveal boxColor="var(--color-primary)" duration={0.3}>
                        <section className="mt-4 text-center">
                            <button className="text-sm text-primary hover:underline outline-hidden hover:cursor-pointer" onClick={goTo}>
                                {textVariantButton}
                            </button>
                        </section>
                    </BoxReveal>
                )}
            </form>
        </section>
    );
});

// ==================== AuthTabs ====================
interface AuthTabsProps {
    formFields: {
        header: string;
        subHeader?: string;
        fields: Array<{
            label: string;
            required?: boolean;
            type: string;
            placeholder: string;
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
        }>;
        submitButton: string;
        textVariantButton?: string;
    };
    goTo: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const AuthTabs = memo(function AuthTabs({ formFields, goTo, handleSubmit }: AuthTabsProps) {
    return (
        <div className="flex max-lg:justify-center w-full md:w-auto">
            <div className="w-full lg:w-1/2 h-[100dvh] flex flex-col justify-center items-center max-lg:px-[10%]">
                <AnimatedForm
                    {...(formFields as any)}
                    fieldPerRow={1}
                    onSubmit={handleSubmit}
                    goTo={goTo}
                    googleLogin="Login with Google"
                />
            </div>
        </div>
    );
});

export { AnimatedInput, BoxReveal, Ripple, OrbitingCircles, AnimatedForm, AuthTabs, Label, BottomGradient, MonitoringIcon, CloudIcon, ShieldIcon, AlertIcon };
