type PageHeaderProps = {
  clubId: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export function PageHeader({ clubId, title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
      <div>
        <h1 className="text-2xl font-bold text-cyan-600">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground font-mono mt-0.5">
            $ {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
