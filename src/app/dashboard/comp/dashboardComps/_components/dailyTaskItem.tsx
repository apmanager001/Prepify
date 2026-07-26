import { DailyTask, TASK_STYLES } from "./taskStyles";

type Props = {
    task: DailyTask;
    onClick: (task: DailyTask) => void;
};

export default function DailyTaskItem({ task, onClick }: Props) {
    const {
        label,
        completed,
        progress,
        coins,
        type,
    } = task;
    
    const style = TASK_STYLES[type];
    const Icon = style.icon;

    return (
        <div
            onClick={() => onClick(task)}
            className={`flex flex-col rounded-lg px-3 py-2 gap-2 ${style.bg} ${style.href
                    ? "cursor-pointer hover:opacity-80 transition hover:scale-[1.02]"
                    : ""
                }`}
        >
            {/* TOP ROW */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center">
                        <Icon size={18} className={style.color} />
                    </div>

                    <div className="flex flex-col">
                        <span
                            className={`text-sm ${completed ? "line-through text-gray-400" : ""
                                }`}
                        >
                            {label}
                        </span>

                        {progress && (
                            <span className="text-xs text-base-content/60">
                                {progress.current}/{progress.target} —{" "}
                                {progress.label}
                            </span>
                        )}
                    </div>
                </div>

                <div className="text-xs font-semibold px-2 py-1 rounded">
                    +{coins}
                </div>
            </div>
        </div>
    );
}