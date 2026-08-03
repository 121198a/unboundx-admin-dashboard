import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { Button, DataTable, ErrorState, Input, Loader, Modal } from "../../components";
import { usePaginatedList } from "../../hooks";
import { useToast } from "../../context";
import { levelActivityApi } from "../../api/api";

/**
 * =====================================================================
 * LEVEL ACTIVITY MODULE — form modal (Create/Edit)
 * =====================================================================
 */

const TASK_MODULES = [
  { label: "Studio", value: 1 },
  { label: "Event", value: 2 },
  { label: "Profile", value: 3 },
  { label: "Sphere", value: 4 },
  { label: "Trade", value: 5 },
  { label: "Admin", value: 6 },
  { label: "Stock Alert", value: 7 },
  { label: "Space", value: 8 },
  { label: "Requests", value: 9 },
  { label: "Competition", value: 10 },
];


function getRequiredCount(task) {
  return task?.required_count ?? task?.requiredCount ?? null;
}

function RequiredLabel({ children }) {
  return (
    <>
      {children} <span className="text-red-500">*</span>
    </>
  );
}

let taskKeyCounter = 0;
function makeEmptyTask() {
  return {
    _key: ++taskKeyCounter,
    title: "",
    description: "",
    required_count: 1,
    xp: 0,
    module: TASK_MODULES[0].value,
  };
}

function toFormTask(task) {
  return {
    _key: ++taskKeyCounter,

    id: task.id,
    taskId: task.taskId,

    title: task.title || "",
    description: task.description || "",
    required_count: getRequiredCount(task) ?? 1,
    xp: task.xp ?? 0,
    module: Number(task.module) || TASK_MODULES[0].value,
  };
}

/* ==========================================================
   CREATE / EDIT FORM MODAL
========================================================== */

function LevelActivityFormModal({ open, level, saving, onClose, onSubmit }) {
  const isEdit = Boolean(level);

  const [name, setName] = useState("");
  const [order, setOrder] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(level?.name || "");
    setOrder(level?.order ?? "");
    setDescription(level?.description || "");
    setTasks(
      Array.isArray(level?.tasks) && level.tasks.length
        ? level.tasks.map(toFormTask)
        : [],
    );
    setAttempted(false);
  }, [open, level]);

  const updateTask = (key, patch) => {
    setTasks((prev) =>
      prev.map((t) => (t._key === key ? { ...t, ...patch } : t)),
    );
  };

  const removeTask = (key) => {
    setTasks((prev) => prev.filter((t) => t._key !== key));
  };

  const addTask = () => {
    setTasks((prev) => [...prev, makeEmptyTask()]);
  };

  const nameValid = name.trim().length > 0;
  const orderValid = order !== "" && !Number.isNaN(Number(order));
  const tasksValid =
    tasks.length > 0 &&
    tasks.every(
      (t) =>
        t.title.trim().length > 0 &&
        t.required_count !== "" &&
        t.xp !== "" &&
        t.module,
    );
  const formValid = nameValid && orderValid && tasksValid;

  const handleSubmit = () => {
    setAttempted(true);

    if (!formValid) return;

    onSubmit({
      name: name.trim(),
      order: Number(order),
      description: description.trim(),

      tasks: tasks.map((t) => ({
        taskId: t.taskId ?? t.id,

        title: t.title.trim(),
        description: t.description.trim(),
        required_count: Number(t.required_count),
        xp: Number(t.xp),
        module: Number(t.module),
      })),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={isEdit ? "Edit Level Activity" : "Create Level Activity"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={saving}
            disabled={saving || (attempted && !formValid)}
          >
            {isEdit ? "Update Level" : "Create Level"}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={<RequiredLabel>Level Name</RequiredLabel>}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={
              attempted && !nameValid ? "Level name is required" : undefined
            }
          />
          <div>
            <Input
              label={<RequiredLabel>Order</RequiredLabel>}
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              error={attempted && !orderValid ? "Order is required" : undefined}
              readOnly={isEdit}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-(--ux-text)">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-(--ux-radius-input) border border-(--ux-border) px-4 py-3 text-sm text-(--ux-text) outline-none transition focus:border-(--ux-purple) focus:ring-2 focus:ring-purple-100"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold text-(--ux-text)">Tasks</h4>
            <Button
              type="button"
              onClick={addTask}
              className="px-4! py-2.5! text-sm"
            >
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </div>

          {tasks.length === 0 && (
            <p className="text-sm font-medium text-red-500">
              At least one task is required
            </p>
          )}

          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div
                key={task._key}
                className="rounded-(--ux-radius-card) border border-(--ux-border) p-5 transition-shadow hover:shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-(--ux-text)">
                    Task {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTask(task._key)}
                    aria-label={`Remove task ${index + 1}`}
                    title="Remove task"
                    className="rounded-md p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <Input
                    label={<RequiredLabel>Title</RequiredLabel>}
                    value={task.title}
                    onChange={(e) =>
                      updateTask(task._key, { title: e.target.value })
                    }
                    error={
                      attempted && !task.title.trim()
                        ? "Title is required"
                        : undefined
                    }
                  />

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-(--ux-text)">
                      Description
                    </label>
                    <textarea
                      value={task.description}
                      onChange={(e) =>
                        updateTask(task._key, { description: e.target.value })
                      }
                      rows={2}
                      className="w-full rounded-(--ux-radius-input) border border-(--ux-border) px-4 py-3 text-sm text-(--ux-text) outline-none transition focus:border-(--ux-purple) focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Input
                      label={<RequiredLabel>Required Count</RequiredLabel>}
                      type="number"
                      value={task.required_count}
                      onChange={(e) =>
                        updateTask(task._key, {
                          required_count: e.target.value,
                        })
                      }
                    />
                    <Input
                      label={<RequiredLabel>XP</RequiredLabel>}
                      type="number"
                      value={task.xp}
                      onChange={(e) =>
                        updateTask(task._key, { xp: e.target.value })
                      }
                    />
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-(--ux-text)">
                        Module <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={task.module}
                        onChange={(e) =>
                          updateTask(task._key, {
                            module: Number(e.target.value),
                          })
                        }
                        className="w-full rounded-(--ux-radius-input) border border-(--ux-border) px-4 py-3 text-sm text-(--ux-text) outline-none transition focus:border-(--ux-purple) focus:ring-2 focus:ring-purple-100"
                      >
                        {TASK_MODULES.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ==========================================================
   TASK EDIT FORM MODAL
========================================================== */

function TaskFormModal({ open, task, saving, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredCount, setRequiredCount] = useState("");
  const [xp, setXp] = useState("");
  const [module, setModule] = useState(TASK_MODULES[0].value);
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setRequiredCount(getRequiredCount(task) ?? 1);
    setXp(task?.xp ?? 0);
    setModule(Number(task?.module) || TASK_MODULES[0].value);
    setAttempted(false);
  }, [open, task]);

  const titleValid = title.trim().length > 0;
  const requiredCountValid =
    requiredCount !== "" && !Number.isNaN(Number(requiredCount));
  const xpValid = xp !== "" && !Number.isNaN(Number(xp));
  const formValid = titleValid && requiredCountValid && xpValid;

  const handleSubmit = () => {
    setAttempted(true);
    if (!formValid) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      required_count: Number(requiredCount),
      xp: Number(xp),
      module: Number(module),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Task"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={saving}
            disabled={saving || (attempted && !formValid)}
          >
            Update Task
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label={<RequiredLabel>Title</RequiredLabel>}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={attempted && !titleValid ? "Title is required" : undefined}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-(--ux-text)">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-(--ux-radius-input) border border-(--ux-border) px-4 py-3 text-sm text-(--ux-text) outline-none transition focus:border-(--ux-purple) focus:ring-2 focus:ring-purple-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input
            label={<RequiredLabel>Required Count</RequiredLabel>}
            type="number"
            value={requiredCount}
            onChange={(e) => setRequiredCount(e.target.value)}
            error={attempted && !requiredCountValid ? "Required" : undefined}
          />
          <Input
            label={<RequiredLabel>XP</RequiredLabel>}
            type="number"
            value={xp}
            onChange={(e) => setXp(e.target.value)}
            error={attempted && !xpValid ? "Required" : undefined}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-(--ux-text)">
              Module <span className="text-red-500">*</span>
            </label>
            <select
              value={module}
              onChange={(e) => setModule(Number(e.target.value))}
              className="w-full rounded-(--ux-radius-input) border border-(--ux-border) px-4 py-3 text-sm text-(--ux-text) outline-none transition focus:border-(--ux-purple) focus:ring-2 focus:ring-purple-100"
            >
              {TASK_MODULES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ==========================================================
   DELETE TASK CONFIRMATION MODAL
========================================================== */

function DeleteTaskModal({ task, deleting, onClose, onConfirm }) {
  return (
    <Modal
      open={Boolean(task)}
      onClose={deleting ? () => {} : onClose}
      title="Delete Task"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            loading={deleting}
            disabled={deleting}
            style={{ backgroundImage: "none" }}
            className="bg-red-600! text-white! hover:bg-red-700!"
          >
            Delete
          </Button>
        </>
      }
    >
      <p className="text-base text-(--ux-text)">
        Are you sure you want to delete{" "}
        <span className="font-semibold">{task?.title}</span> from this level?
        This action cannot be undone.
      </p>
    </Modal>
  );
}

/* ==========================================================
   LIST PAGE
========================================================== */

function taskCount(row) {
  if (Array.isArray(row.tasks)) return row.tasks.length;
  return row.tasks_count ?? row.total_tasks ?? 0;
}

const iconButtonClasses =
  "rounded-lg border border-(--ux-border) p-2 text-(--ux-text-muted) transition-colors hover:border-(--ux-purple) hover:bg-purple-50 hover:text-(--ux-purple) focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-100";

export function LevelActivityList() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null); // null = create mode
  const [saving, setSaving] = useState(false);
  const [editLoadingId, setEditLoadingId] = useState(null);

  const { rows, pagination, page, setPage, loading, error, reload } =
    usePaginatedList(levelActivityApi.list, {
      pageSize: 10,
    });

  const openCreate = () => {
    setEditingLevel(null);
    setModalOpen(true);
  };

  const openEdit = async (row) => {
    setEditLoadingId(row.id);
    try {
      const full = await levelActivityApi.get(row.id);
      setEditingLevel(full || row);
      setModalOpen(true);
    } catch (err) {
      showToast(
        err?.message || "Could not load this level. Please try again.",
        "error",
      );
    } finally {
      setEditLoadingId(null);
    }
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editingLevel) {
        await levelActivityApi.update(editingLevel.id, payload);
        showToast("Level updated successfully.", "success");
      } else {
        await levelActivityApi.create(payload);
        showToast("Level created successfully.", "success");
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      showToast(
        err?.message || "Something went wrong. Please try again.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: "order",
      header: "Order",
      render: (row) => (
        <span className="font-medium text-(--ux-text)">{row.order ?? "-"}</span>
      ),
    },
    {
      key: "name",
      header: "Level Name",
      render: (row) => (
        <div>
          <p className="font-semibold text-(--ux-text)">{row.name || "-"}</p>
          {row.description && (
            <p className="mt-0.5 line-clamp-1 max-w-md text-xs text-(--ux-text-muted)">
              {row.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "tasks",
      header: "Tasks",
      render: taskCount,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              navigate(`/dashboard/level-activity/${row.id ?? row._id}`)
            }
            aria-label={`View ${row.name}`}
            title="View"
            className={iconButtonClasses}
          >
            <Eye className="h-18px w-18px" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => openEdit(row)}
            disabled={editLoadingId === row.id}
            aria-label={`Edit ${row.name}`}
            title="Edit"
            className={iconButtonClasses}
          >
            <Pencil className="h-18px w-18px" strokeWidth={1.75} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--ux-text)">
            Level Activity
          </h1>
          <p className="mt-1 text-sm text-(--ux-text-muted)">
            Manage level-based activities and tasks
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="rounded-(--ux-radius-active) bg-(--ux-purple-dark) px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-(--ux-purple) hover:shadow-md active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Create Level
        </Button>
      </div>

      <div className="overflow-hidden rounded-(--ux-radius-card) border border-(--ux-border) bg-white shadow-sm">
        <DataTable
          columns={columns}
          rows={rows}
          loading={loading}
          error={error}
          onRetry={reload}
          page={page}
          pagination={pagination}
          onPageChange={setPage}
          onPageSizeChange={() => {}}
          emptyTitle="No levels yet"
          emptyMessage="Create your first level to get started."
        />
      </div>

      <LevelActivityFormModal
        open={modalOpen}
        level={editingLevel}
        saving={saving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

/* ==========================================================
   VIEW / DETAIL PAGE
========================================================== */

function InfoCard({ label, value }) {
  return (
    <div className="rounded-(--ux-radius-card) border border-(--ux-border) bg-white p-5 shadow-sm">
      <p className="text-sm text-(--ux-text-muted)">{label}</p>
      <p className="mt-1 text-lg font-semibold text-(--ux-text)">{value}</p>
    </div>
  );
}

export function LevelActivityView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [savingTask, setSavingTask] = useState(false);

  const [deleteTaskIndex, setDeleteTaskIndex] = useState(null);
  const [deletingTask, setDeletingTask] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await levelActivityApi.get(id);
      setLevel(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const tasks = Array.isArray(level?.tasks) ? level.tasks : [];

  // The level's own XP field mostly isn't populated by the backend — it's
  // meant to be the sum of every task's XP, so compute it here rather than
  // trusting a possibly-empty level.xp.
  const totalXp = tasks.length
    ? tasks.reduce((sum, t) => sum + (Number(t.xp) || 0), 0)
    : (level?.xp ?? 0);

  const editingTask =
    editingTaskIndex !== null ? tasks[editingTaskIndex] : null;
  const deleteTaskTarget =
    deleteTaskIndex !== null ? tasks[deleteTaskIndex] : null;

  const openEditTask = (index) => {
    setEditingTaskIndex(index);
    setTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    if (savingTask) return;
    setTaskModalOpen(false);
  };

  // Only a level-level PUT (/api/users/edit-level) exists — there's no
  // dedicated "edit one task" endpoint — so editing a task sends the whole
  // level back with just that one task's fields swapped in.
  const handleTaskSubmit = async (payload) => {
    if (!level || editingTaskIndex === null) return;
    setSavingTask(true);
    try {
      const updatedTasks = tasks.map((t, i) =>
        i === editingTaskIndex ? { ...t, ...payload } : t,
      );
      await levelActivityApi.update(level.id, {
        name: level.name,
        order: level.order,
        description: level.description,
        maxXp: tasks.reduce((sum, t) => sum + (Number(t.xp) || 0), 0),

        tasks: updatedTasks.map((t) => ({
          taskId: t.id,
          title: t.title,
          description: t.description,
          requiredCount: t.required_count ?? t.requiredCount,
          xp: Number(t.xp),
          module: Number(t.module),
        })),
      });
      showToast("Task updated successfully.", "success");
      setTaskModalOpen(false);
      load();
    } catch (err) {
      showToast(
        err?.message || "Could not update this task. Please try again.",
        "error",
      );
    } finally {
      setSavingTask(false);
    }
  };

  const openDeleteTask = (index) => setDeleteTaskIndex(index);
  const closeDeleteTask = () => {
    if (deletingTask) return;
    setDeleteTaskIndex(null);
  };

  const handleDeleteTask = async () => {
    if (!level || deleteTaskIndex === null) return;
    setDeletingTask(true);
    const target = tasks[deleteTaskIndex];
    try {
      if (target?.id) {
        // Real per-task delete endpoint.
        await levelActivityApi.deleteTask(level.id, target.id);
      } else {
        const updatedTasks = tasks.filter((_, i) => i !== deleteTaskIndex);
        await levelActivityApi.update(level.id, {
          name: level.name,
          order: level.order,
          description: level.description,
          tasks: updatedTasks,
        });
      }
      showToast("Task deleted successfully.", "success");
      setDeleteTaskIndex(null);
      load();
    } catch (err) {
      showToast(
        err?.message || "Could not delete this task. Please try again.",
        "error",
      );
    } finally {
      setDeletingTask(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard/level-activity")}
          aria-label="Back to Level Activity"
          title="Back"
          className="rounded-lg p-1.5 text-(--ux-text) transition-colors hover:bg-gray-100 hover:text-(--ux-text-muted)"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-(--ux-text)">
            Level Activity — Tasks
          </h1>
          {level?.name && (
            <p className="text-sm text-(--ux-text-muted)">{level.name}</p>
          )}
        </div>
      </div>

      {loading && <Loader full label="Loading level details..." />}

      {!loading && error && <ErrorState error={error} onRetry={load} />}

      {!loading && !error && level && (
        <>
          <div className="rounded-(--ux-radius-card) border border-(--ux-border) bg-white p-5 shadow-sm">
            <p className="text-sm text-(--ux-text-muted)">Description</p>
            <p className="mt-1 text-sm font-semibold text-(--ux-text)">
              {level.description || "-"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InfoCard label="XP" value={totalXp} />
            <InfoCard label="Order" value={level.order ?? "-"} />
            <InfoCard label="Total Tasks" value={tasks.length} />
          </div>

          <div className="overflow-hidden rounded-(--ux-radius-card) border border-(--ux-border) bg-white shadow-sm">
            <table className="w-full min-w-720px text-left">
              <thead>
                <tr className="h-12 border-b border-(--ux-border) bg-gray-50">
                  <th className="whitespace-nowrap px-6 text-xs font-semibold uppercase tracking-wide text-(--ux-text-muted)">
                    #
                  </th>
                  <th className="whitespace-nowrap px-6 text-xs font-semibold uppercase tracking-wide text-(--ux-text-muted)">
                    Task
                  </th>
                  <th className="whitespace-nowrap px-6 text-xs font-semibold uppercase tracking-wide text-(--ux-text-muted)">
                    Required Count
                  </th>
                  <th className="whitespace-nowrap px-6 text-xs font-semibold uppercase tracking-wide text-(--ux-text-muted)">
                    XP
                  </th>
                  <th className="whitespace-nowrap px-6 text-xs font-semibold uppercase tracking-wide text-(--ux-text-muted)">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr
                    key={task.id ?? index}
                    className="border-b border-(--ux-border) transition-colors last:border-0 hover:bg-gray-50/60"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-(--ux-text)">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-(--ux-text)">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="mt-0.5 max-w-md text-xs text-(--ux-text-muted)">
                          {task.description}
                        </p>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-(--ux-text)">
                      {getRequiredCount(task) ?? "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-(--ux-text)">
                      {task.xp ?? "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditTask(index)}
                          aria-label={`Edit ${task.title}`}
                          title="Edit"
                          className={iconButtonClasses}
                        >
                          <Pencil
                            className="h-18px w-18px"
                            strokeWidth={1.75}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteTask(index)}
                          aria-label={`Delete ${task.title}`}
                          title="Delete"
                          className="rounded-lg border border-(--ux-border) p-2 text-(--ux-text-muted)
                           transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-100"
                        >
                          <Trash2
                            className="h-18px w-18px"
                            strokeWidth={1.75}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-sm text-(--ux-text-muted)"
                    >
                      No tasks added to this level yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <TaskFormModal
        open={taskModalOpen}
        task={editingTask}
        saving={savingTask}
        onClose={closeTaskModal}
        onSubmit={handleTaskSubmit}
      />

      <DeleteTaskModal
        task={deleteTaskTarget}
        deleting={deletingTask}
        onClose={closeDeleteTask}
        onConfirm={handleDeleteTask}
      />
    </div>
  );
}
