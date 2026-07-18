import type { ReactNode } from "react";


interface AuthCardProps {

    title: string;

    description?: string;

    children: ReactNode;

    footer?: ReactNode;

}



export const AuthCard = ({
    title,
    description,
    children,
    footer,

}: AuthCardProps) => {


    return (

        <div className=" flex flex-1 items-center justify-center bg-background px-4">


            <div className=" w-full max-w-sm rounded-2xl border border-border bg-card text-card-foreground p-8 shadow-xl">


                <div className="mb-7">


                    <h1 className=" text-3xl font-bold text-foreground">

                        {title}

                    </h1>



                    {description && (

                        <p className=" mt-2 text-sm text-muted-foreground">

                            {description}

                        </p>

                    )}


                </div>



                {children}



                {footer && (

                    <div className="mt-7">

                        {footer}

                    </div>

                )}


            </div>


        </div>

    );


};