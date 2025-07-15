# 实现“添加新水泵”功能的设计文档

本文档详细说明了在项目中添加“新建水泵”功能的完整步骤和设计思路。

## 1. 核心目标

允许用户通过一个模态框表单来添加一个新的水泵记录，并将新记录实时更新到主列表上。

## 2. 功能实现步骤

我们将分四步来完成此功能的开发，确保代码的模块化和可维护性。

### 第一步：创建 `NewPumpModal` UI组件

这是用户交互的核心界面。

- **位置**: `src/app/PumpPage/components/NewPumpModal/NewPumpModal.tsx`
- **技术栈**: 使用 `react-bootstrap` 的 `Modal` 和 `Form` 组件。
- **功能**:
  1.  **构建表单**: 基于 `src/types/pump.ts` 中的 `PumpFormData` 接口，创建包含以下字段的表单：
      - `name` (文本输入)
      - `type` (下拉选择框: 'Centrifugal', 'Submersible', etc.)
      - `area` (文本输入)
      - `latitude`, `longitude` (数字输入)
      - `flowRate`, `offset` (数字输入)
      - `status` (下拉选择框: 'Operational', 'Maintenance', etc.)
  2.  **组件Props**:
      - `show: boolean`: 控制模态框的显示与隐藏。
      - `onHide: () => void`: 关闭模态框时触发的回调函数。
      - `onSave: (formData: PumpFormData) => void`: 点击保存按钮时，将表单数据传递出去的回调函数。
  3.  **内部状态**: 组件内部使用 `useState` 来管理整个表单的数据。
  4.  **文件结构**: 同时创建 `index.ts` 以便模块化导出。

### 第二步：在 `usePump` Hook 中添加业务逻辑

`usePump` hook 是我们应用的状态管理中心，所有与数据相关的逻辑都将在这里实现。

- **位置**: `src/hooks/usePump.tsx`
- **修改内容**:
  1.  **添加新State**:
      - `const [showNewPumpModal, setShowNewPumpModal] = useState(false);`
      - 用于全局控制 `NewPumpModal` 的可见性。
  2.  **添加新处理函数 (Handlers)**:
      - `handleShowNewPumpModal()`: 调用 `setShowNewPumpModal(true)`，打开模态框。
      - `handleHideNewPumpModal()`: 调用 `setShowNewPumpModal(false)`，关闭模态框。
      - `handleAddNewPump(formData: PumpFormData)`:
        - 接收来自模态框的表单数据。
        - 根据 `formData` 创建一个完整的新 `Pump` 对象（包括生成 `id`, 设置 `createdAt`, `updatedAt` 和一个初始的 `pressure` 数组）。
        - 将这个新 `Pump` 对象添加到 `pumps` 和 `originalPumps` 两个状态数组中，以确保数据的一致性。
        - 调用 `handleHideNewPumpModal()` 在保存后自动关闭模态框。
  3.  **更新 `PumpContextType`**:
      - 将新添加的 state (`showNewPumpModal`) 和 handlers 暴露给应用的其余部分。

### 第三步：连接 `PumpsHeader` 中的 "New Pump" 按钮

让用户可以触发我们的新功能。

- **位置**: `src/app/PumpPage/components/PumpsHeader/PumpsHeader.tsx`
- **修改内容**:
  1.  在 `PumpsHeader` 组件中，导入并使用 `usePump()` hook。
  2.  从 hook 中获取 `handleShowNewPumpModal` 方法。
  3.  将此方法绑定到桌面端和移动端两个 "New Pump" 按钮的 `onClick` 事件上。

### 第四步：在 `PumpPage` 中渲染模态框

最后一步，将我们创建的UI组件和业务逻辑整合到页面上。

- **位置**: `src/app/PumpPage/PumpPage.tsx`
- **修改内容**:
  1.  导入我们新创建的 `NewPumpModal` 组件。
  2.  在 `PumpPageContent` 组件内部，使用 `usePump()` hook 获取模态框所需的所有状态和函数：
      - `showNewPumpModal`
      - `handleHideNewPumpModal`
      - `handleAddNewPump`
  3.  在 JSX 中渲染 `<NewPumpModal />`，并将这些状态和函数作为 props 传递给它。

## 3. (可选) 后续优化

- **表单验证**: 在 `NewPumpModal` 中添加客户端表单验证，例如必填字段、数字格式等，以提升用户体验。可以使用 `react-bootstrap` 内置的验证功能或 `Formik`/`React Hook Form` 等库。
- **加载状态**: 在 `handleAddNewPump` 执行异步操作（如果未来需要调用API）时，在保存按钮上显示一个加载指示器。

---

这份文档为接下来的开发工作提供了清晰的路线图。
