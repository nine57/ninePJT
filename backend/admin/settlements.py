from django.contrib import admin

from apps.settlements.models import (
    Expense,
    ExpenseAttachment,
    ExpenseItem,
    ExpenseShare,
    Settlement,
    SettlementExpense,
    SettlementGroup,
    SettlementTransfer,
    Transaction,
    TransactionAttachment,
)


@admin.register(SettlementGroup)
class SettlementGroupAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "organization", "is_active", "created_at"]
    list_filter = ["is_active", "organization"]
    search_fields = ["name", "description", "organization__name"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = [
        "merchant_name",
        "group",
        "payer",
        "amount",
        "currency",
        "paid_at",
        "payment_method",
        "is_settled",
    ]
    list_filter = [
        "group",
        "payer",
        "is_settled",
        "payment_method",
        "currency",
    ]
    search_fields = [
        "merchant_name",
        "memo",
        "group__name",
        "payer__username",
    ]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(ExpenseItem)
class ExpenseItemAdmin(admin.ModelAdmin):
    list_display = ["expense", "name", "quantity", "unit_price", "total_price"]
    search_fields = ["expense__merchant_name", "name"]
    list_filter = ["expense__group"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(ExpenseAttachment)
class ExpenseAttachmentAdmin(admin.ModelAdmin):
    list_display = ["expense", "file_path", "created_at"]
    search_fields = ["expense__merchant_name", "file_path"]
    readonly_fields = ["created_at"]


@admin.register(ExpenseShare)
class ExpenseShareAdmin(admin.ModelAdmin):
    list_display = ["id", "expense", "user", "amount"]
    list_filter = ["expense__group"]
    search_fields = ["user__username", "expense__merchant_name"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(Settlement)
class SettlementAdmin(admin.ModelAdmin):
    list_display = ["id", "group", "confirmed_by", "total_amount", "member_count", "confirmed_at"]
    list_filter = ["group"]
    search_fields = ["group__name", "confirmed_by__username"]
    readonly_fields = ["created_at", "updated_at", "confirmed_at"]


@admin.register(SettlementTransfer)
class SettlementTransferAdmin(admin.ModelAdmin):
    list_display = ["id", "settlement", "from_user", "to_user", "amount", "is_paid", "paid_at"]
    list_filter = ["is_paid", "settlement__group"]
    search_fields = ["from_user__username", "to_user__username"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(SettlementExpense)
class SettlementExpenseAdmin(admin.ModelAdmin):
    list_display = ["id", "settlement", "expense"]
    list_filter = ["settlement__group"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = [
        "counterparty_name",
        "group",
        "amount",
        "currency",
        "transaction_type",
        "transacted_at",
        "balance",
    ]
    list_filter = [
        "group",
        "transaction_type",
        "currency",
    ]
    search_fields = [
        "counterparty_name",
        "memo",
        "group__name",
    ]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(TransactionAttachment)
class TransactionAttachmentAdmin(admin.ModelAdmin):
    list_display = ["transaction", "file_path", "created_at"]
    search_fields = ["transaction__counterparty_name", "file_path"]
    readonly_fields = ["created_at", "updated_at"]
